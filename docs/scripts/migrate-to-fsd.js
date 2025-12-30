#!/usr/bin/env node

/**
 * FSD Architecture Migration Script
 * This script helps migrate from Next.js App Router structure to Feature-Sliced Design
 */

const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}`),
};

const SOURCE_DIR = path.join(process.cwd(), "omechu-app", "src");
const APP_DIR = path.join(SOURCE_DIR, "app");

// FSD Structure Mapping
const FSD_STRUCTURE = {
  shared: {
    ui: [],
    api: [],
    lib: [],
    hooks: [],
    constants: [],
    types: [],
  },
  entities: {
    user: { api: [], model: [], ui: [], types: [] },
    restaurant: { api: [], model: [], ui: [], types: [] },
    menu: { api: [], model: [], ui: [], types: [] },
    review: { api: [], model: [], ui: [], types: [] },
    order: { api: [], model: [], ui: [], types: [] },
  },
  widgets: {},
  app: {
    providers: [],
    routes: [],
    layouts: [],
    styles: [],
  },
};

// Mapping rules for existing structure to FSD
const MAPPING_RULES = {
  // Shared layer mappings
  "components/common": "shared/ui",
  "lib/api": "shared/api",
  "lib/hooks": "shared/hooks",
  "lib/providers": "app/providers",
  "lib/stores": "entities/*/model",
  "lib/schemas": "shared/types",
  constant: "shared/constants",

  // Entity layer mappings
  auth: "entities/user",
  "mypage/api": "entities/user/api",
  "mypage/hooks": "entities/user/hooks",
  "mypage/types": "entities/user/types",

  restaurant: "entities/restaurant",

  // Widget layer mappings
  "components/mainpage": "widgets/food-recommendation",
  "components/mypage": "widgets/user-profile",
  "components/settings": "widgets/settings",

  // App layer mappings
  "layout.tsx": "app/layouts/root.layout.tsx",
  "ClientLayout.tsx": "app/layouts/client.layout.tsx",
  "globals.css": "app/styles/globals.css",
};

/**
 * Create FSD directory structure
 */
function createFSDStructure() {
  log.title("Creating FSD Directory Structure");

  const layers = ["shared", "entities", "widgets", "app"];

  layers.forEach((layer) => {
    const layerPath = path.join(SOURCE_DIR, layer);

    if (!fs.existsSync(layerPath)) {
      fs.mkdirSync(layerPath, { recursive: true });
      log.success(`Created layer: ${layer}/`);
    } else {
      log.info(`Layer exists: ${layer}/`);
    }
  });

  // Create shared subdirectories
  const sharedDirs = ["ui", "api", "lib", "hooks", "constants", "types"];
  sharedDirs.forEach((dir) => {
    const dirPath = path.join(SOURCE_DIR, "shared", dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log.success(`Created: shared/${dir}/`);
    }
  });

  // Create entity directories
  const entities = ["user", "restaurant", "menu", "review", "order"];
  entities.forEach((entity) => {
    const entityPath = path.join(SOURCE_DIR, "entities", entity);
    if (!fs.existsSync(entityPath)) {
      fs.mkdirSync(entityPath, { recursive: true });
    }

    const subdirs = ["api", "model", "ui", "types", "lib"];
    subdirs.forEach((subdir) => {
      const subdirPath = path.join(entityPath, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    });
    log.success(`Created entity: ${entity}/`);
  });

  // Create app subdirectories
  const appDirs = ["providers", "routes", "layouts", "styles"];
  appDirs.forEach((dir) => {
    const dirPath = path.join(SOURCE_DIR, "app", dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log.success(`Created: app/${dir}/`);
    }
  });
}

/**
 * Create barrel export files (index.ts)
 */
function createBarrelExports() {
  log.title("Creating Barrel Export Files");

  // Shared layer exports
  const sharedDirs = ["ui", "api", "lib", "hooks", "constants", "types"];
  sharedDirs.forEach((dir) => {
    const indexPath = path.join(SOURCE_DIR, "shared", dir, "index.ts");
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, `// Export all ${dir}\n`);
      log.success(`Created: shared/${dir}/index.ts`);
    }
  });

  // Main shared index
  const sharedIndex = path.join(SOURCE_DIR, "shared", "index.ts");
  if (!fs.existsSync(sharedIndex)) {
    const exports = sharedDirs
      .map((dir) => `export * from './${dir}';`)
      .join("\n");
    fs.writeFileSync(sharedIndex, exports + "\n");
    log.success("Created: shared/index.ts");
  }

  // Entity exports
  const entities = ["user", "restaurant", "menu", "review", "order"];
  entities.forEach((entity) => {
    const subdirs = ["api", "model", "ui", "types"];

    // Create subdirectory indexes
    subdirs.forEach((subdir) => {
      const indexPath = path.join(
        SOURCE_DIR,
        "entities",
        entity,
        subdir,
        "index.ts",
      );
      if (!fs.existsSync(indexPath)) {
        fs.writeFileSync(indexPath, `// Export all ${entity} ${subdir}\n`);
      }
    });

    // Create entity index
    const entityIndex = path.join(SOURCE_DIR, "entities", entity, "index.ts");
    if (!fs.existsSync(entityIndex)) {
      const exports = subdirs
        .map((dir) => `export * from './${dir}';`)
        .join("\n");
      fs.writeFileSync(entityIndex, exports + "\n");
      log.success(`Created: entities/${entity}/index.ts`);
    }
  });
}

/**
 * Generate migration report
 */
function generateMigrationReport() {
  log.title("Generating Migration Report");

  const report = {
    timestamp: new Date().toISOString(),
    currentStructure: [],
    proposedMoves: [],
    manualActions: [],
  };

  // Scan current structure
  function scanDirectory(dir, relativePath = "") {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const itemRelativePath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith(".") &&
        item !== "node_modules"
      ) {
        report.currentStructure.push({
          type: "directory",
          path: itemRelativePath,
        });
        scanDirectory(fullPath, itemRelativePath);
      } else if (
        stat.isFile() &&
        (item.endsWith(".ts") || item.endsWith(".tsx"))
      ) {
        report.currentStructure.push({
          type: "file",
          path: itemRelativePath,
        });

        // Determine where this file should go
        const suggestion = suggestNewLocation(itemRelativePath);
        if (suggestion) {
          report.proposedMoves.push({
            from: itemRelativePath,
            to: suggestion,
          });
        } else {
          report.manualActions.push({
            file: itemRelativePath,
            reason: "Requires manual classification",
          });
        }
      }
    });
  }

  if (fs.existsSync(APP_DIR)) {
    scanDirectory(APP_DIR);
  }

  // Write report
  const reportPath = path.join(process.cwd(), "fsd-migration-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log.success(`Migration report saved to: fsd-migration-report.json`);

  // Display summary
  log.title("Migration Summary");
  log.info(
    `Total files: ${report.currentStructure.filter((i) => i.type === "file").length}`,
  );
  log.info(
    `Total directories: ${report.currentStructure.filter((i) => i.type === "directory").length}`,
  );
  log.info(`Proposed moves: ${report.proposedMoves.length}`);
  log.warning(`Manual actions required: ${report.manualActions.length}`);
}

/**
 * Suggest new location based on mapping rules
 */
function suggestNewLocation(filePath) {
  // Check direct mappings
  for (const [pattern, target] of Object.entries(MAPPING_RULES)) {
    if (filePath.includes(pattern)) {
      return target + "/" + path.basename(filePath);
    }
  }

  // Pattern-based suggestions
  if (filePath.includes("components/common")) {
    return "shared/ui/" + path.basename(filePath);
  }
  if (filePath.includes("/api/") || filePath.endsWith(".api.ts")) {
    return "shared/api/" + path.basename(filePath);
  }
  if (filePath.includes("/hooks/") || filePath.includes("use")) {
    return "shared/hooks/" + path.basename(filePath);
  }
  if (filePath.includes("/types/") || filePath.endsWith(".types.ts")) {
    return "shared/types/" + path.basename(filePath);
  }
  if (filePath.includes("/store") || filePath.endsWith(".store.ts")) {
    return "entities/[entity]/model/" + path.basename(filePath);
  }

  return null;
}

/**
 * Create sample files to demonstrate FSD structure
 */
function createSampleFiles() {
  log.title("Creating Sample FSD Files");

  // Sample shared UI component
  const buttonComponent = `// Sample Button Component following FSD
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick
}) => {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
`;

  const buttonPath = path.join(
    SOURCE_DIR,
    "shared",
    "ui",
    "button",
    "button.ui.tsx",
  );
  const buttonDir = path.dirname(buttonPath);

  if (!fs.existsSync(buttonDir)) {
    fs.mkdirSync(buttonDir, { recursive: true });
  }

  if (!fs.existsSync(buttonPath)) {
    fs.writeFileSync(buttonPath, buttonComponent);
    fs.writeFileSync(
      path.join(buttonDir, "index.ts"),
      "export { Button } from './button.ui';\nexport type { ButtonProps } from './button.ui';\n",
    );
    log.success("Created sample: shared/ui/button/");
  }

  // Sample entity
  const userTypes = `// User entity types
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
`;

  const userTypesPath = path.join(
    SOURCE_DIR,
    "entities",
    "user",
    "types",
    "user.types.ts",
  );
  if (!fs.existsSync(userTypesPath)) {
    fs.writeFileSync(userTypesPath, userTypes);
    log.success("Created sample: entities/user/types/user.types.ts");
  }
}

/**
 * Main execution
 */
function main() {
  console.log(`
${colors.bright}========================================
     FSD Architecture Migration Tool
========================================${colors.reset}
`);

  try {
    // Step 1: Create directory structure
    createFSDStructure();

    // Step 2: Create barrel exports
    createBarrelExports();

    // Step 3: Create sample files
    createSampleFiles();

    // Step 4: Generate migration report
    generateMigrationReport();

    console.log(`
${colors.green}${colors.bright}========================================
     Migration Preparation Complete!
========================================${colors.reset}

${colors.bright}Next Steps:${colors.reset}
1. Review the migration report: fsd-migration-report.json
2. Start moving files according to the proposed structure
3. Update import paths to use @/shared, @/entities, @/widgets, @/app
4. Run 'pnpm lint' to check for import errors
5. Test the application thoroughly

${colors.yellow}Note: This is a preparation script. Actual file migration should be done carefully to avoid breaking the application.${colors.reset}
`);
  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createFSDStructure, createBarrelExports };
