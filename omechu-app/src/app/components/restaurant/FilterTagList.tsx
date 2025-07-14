import TagItem from "@/app/components/common/TagItem";

type FilterTagListProps = {
  tags: string[];
  onRemove: (tag: string) => void;
};

export default function FilterTagList({ tags, onRemove }: FilterTagListProps) {
  return (
    <div className="flex overflow-x-auto whitespace-nowrap gap-2 mx-2 scrollbar-hide">
      {tags.map((tag, idx) => (
        <TagItem key={idx} label={tag} onRemove={() => onRemove(tag)} className="px-2" />
      ))}
    </div>
  );
}
