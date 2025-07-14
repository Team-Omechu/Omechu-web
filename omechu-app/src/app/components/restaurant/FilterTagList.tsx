import TagItem from "@/app/components/common/TagItem";

type FilterTagListProps = {
  tags: string[];
  onRemove: (tag: string) => void;
};

export default function FilterTagList({ tags, onRemove }: FilterTagListProps) {
  return (
    <div className="mx-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {tags.map((tag, idx) => (
        <TagItem
          key={idx}
          label={tag}
          onRemove={() => onRemove(tag)}
          className="px-2"
        />
      ))}
    </div>
  );
}
