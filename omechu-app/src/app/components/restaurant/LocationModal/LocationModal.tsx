import { useEffect, useState } from "react";

import Image from "next/image";

import Header from "@/components/common/Header";
import { regionData } from "@/constant/RegionList";

import SectionHeader from "./SecionHeader";
import SelectableList from "./SelectableList";
import TagList from "./TagList";
import ToggleableList from "./TogglealbeList";

type FilterModalProps = {
  onClose: () => void;
  onApply: (selected: string[]) => void;
  selected: string[];
};

export default function LocationModal({
  onClose,
  onApply,
  selected,
}: FilterModalProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selected);
  const [selectedCity, setSelectedCity] = useState("서울특별시");
  const [selectedDistrict, setSelectedDistrict] = useState("강북구");
  const cities = Object.keys(regionData);
  const districts = Object.keys(regionData[selectedCity] || {});
  const towns = regionData[selectedCity]?.[selectedDistrict] || [];

  useEffect(() => {
    const defaultCity = Object.keys(regionData)[0];
    const defaultDistrict = Object.keys(regionData[defaultCity] || {})[0];
    setSelectedCity(defaultCity);
    setSelectedDistrict(defaultDistrict);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen bg-[#F8D5FF]">
      <Header
        title={"희망 지역 선택"}
        rightChild={
          <button onClick={onClose}>
            <Image
              src={"/close_button.png"}
              alt={"닫기"}
              width={18}
              height={18}
            />
          </button>
        }
      />
      <div className="mx-4 my-6">
        <SectionHeader titles={["시·도", "시·군·구", "동·읍·면"]} />

        <div className="grid h-[28rem] grid-cols-3 border-b border-gray-400 text-center">
          <SelectableList
            items={cities}
            selected={selectedCity}
            onSelect={(city) => {
              setSelectedCity(city);
              setSelectedDistrict(Object.keys(regionData[city])[0]);
            }}
          />

          <SelectableList
            items={districts}
            selected={selectedDistrict}
            onSelect={(district) => {
              if (district === "전체") {
                const full = `${selectedCity} 전체`;
                if (tempSelected.includes(full)) {
                  setTempSelected(tempSelected.filter((t) => t !== full));
                } else {
                  if (tempSelected.length >= 5) return;
                  setTempSelected([...tempSelected, full]);
                }
              } else {
                setSelectedDistrict(district);
              }
            }}
            topItems={["전체"]}
          />

          <ToggleableList
            items={towns.map((town) => ({
              label: town,
              value: `${selectedCity} ${selectedDistrict} ${town}`,
            }))}
            selectedValues={tempSelected}
            onToggle={(item) =>
              setTempSelected((prev) =>
                prev.includes(item)
                  ? prev.filter((i) => i !== item)
                  : [...prev, item],
              )
            }
            maxSelected={5}
          />
        </div>

        <div className="mb-2 mt-4 pl-2 text-base text-gray-600">
          {tempSelected.length}/5
        </div>
        <TagList
          items={tempSelected}
          onRemove={(item) =>
            setTempSelected(tempSelected.filter((t) => t !== item))
          }
        />

        <div className="mt-6 text-center">
          <button
            className="w-40 rounded-lg bg-[#FB4746] py-4 text-base font-semibold text-white"
            onClick={() => {
              onApply(tempSelected);
              onClose();
            }}
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
