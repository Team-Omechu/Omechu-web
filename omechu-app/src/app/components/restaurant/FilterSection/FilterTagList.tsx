import TagItem from "@/app/components/common/TagItem";

type FilterTagListProps = {
  tags: string[];
  onRemove: (tag: string) => void;
  className?: string;
};

export default function FilterTagList({
  tags,
  onRemove,
  className,
}: FilterTagListProps) {
  return (
    <div className="mx-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {tags.map((tag, idx) => (
        <TagItem
          key={tag}
          label={tag}
          onRemove={() => onRemove(tag)}
          className={className}
        />
      ))}
    </div>
  );
}
