import Keyword from "@/components/common/Keyword";

const allTags = [
  "아침식사",
  "점심식사",
  "저녁식사",
  "야식",
  "혼밥",
  "데이트",
  "가족",
  "단체회식",
  "고급스러운",
  "가성비",
  "기념일",
  "술모임",
  "시끌벅적한",
  "깔끔한",
  "캐주얼한",
  "조용한",
];

interface TagSelectorProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  maxSelected?: number;
}

export default function TagSelector({
  selectedTags,
  setSelectedTags,
  maxSelected = 5,
}: TagSelectorProps) {
  const handleTagToggle = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < maxSelected) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="mb-10">
      <p className="mb-3 text-sm text-gray-700">
        이 식당을 <span className="font-bold">한마디로</span> 표현한다면?* (1~
        {maxSelected}개)
      </p>
      <div className="flex flex-wrap justify-center gap-1 rounded-md border border-grey-dark-hover bg-white p-2">
        {allTags.map((tag) => (
          <Keyword
            key={tag}
            label={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => handleTagToggle(tag)}
            className="my-2"
          />
        ))}
      </div>
    </div>
  );
}
