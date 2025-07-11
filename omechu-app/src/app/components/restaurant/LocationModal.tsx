import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/app/components/common/Header";
import { regionData } from "../../constant/RegionList";

type FilterModalProps = {
onClose: () => void;
onApply: (selected: string[]) => void;
selected: string[];
};

export default function FilterModal({ onClose, onApply, selected }: FilterModalProps) {
    const [tempSelected, setTempSelected] = useState<string[]>(selected);
    const [selectedCity, setSelectedCity] = useState("서울특별시");
    const [selectedDistrict, setSelectedDistrict] = useState("강북구");
    const cities = Object.keys(regionData);
    const districts = Object.keys(regionData[selectedCity] || {});
    const towns = regionData[selectedCity]?.[selectedDistrict] || [];

    const toggleTown = (town: string) => {
        const full = `${selectedCity} ${selectedDistrict} ${town}`;
        if (tempSelected.includes(full)) {
            setTempSelected(tempSelected.filter((t) => t !== full));
        } else {
            if (tempSelected.length >= 5) return;
            setTempSelected([...tempSelected, full]);
        }
    };

    useEffect(() => {
        const defaultCity = Object.keys(regionData)[0];
        const defaultDistrict = Object.keys(regionData[defaultCity] || {})[0];
        setSelectedCity(defaultCity);
        setSelectedDistrict(defaultDistrict);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#F8D5FF] w-screen h-screen">
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
                <div className="grid grid-cols-3 border-b border-gray-300">
                    <div className="bg-[#00A3FF] text-white text-center py-2 text-sm border-r border-white">시·도</div>
                    <div className="bg-[#00A3FF] text-white text-center py-2 text-sm border-r border-white">시·구·군</div>
                    <div className="bg-[#00A3FF] text-white text-center py-2 text-sm">동·읍·면</div>
                </div>

                <div className="grid grid-cols-3 text-center border-b border-gray-400 h-[28rem]">
                    <div className="border-r border-gray-300 overflow-y-auto scrollbar-hide">
                    {cities.map((city) => (
                        <button
                            key={city}
                            className={`block w-full px-3 py-2 text-sm ${selectedCity === city ? "bg-gray-400 text-white rounded-full" : ""}`}
                            onClick={() => {
                                setSelectedCity(city);
                            }}
                        >
                            {city.replace("특별시", "")}
                        </button>
                    ))}
                    </div>

                    <div className="border-r border-gray-300 overflow-y-auto scrollbar-hide">
                        <button 
                            className="block w-full px-3 py-2 text-sm"
                            onClick={() => {
                                const full = `${selectedCity} 전체`;
                                if (tempSelected.includes(full)) {
                                    setTempSelected(tempSelected.filter((t) => t !== full));
                                } else {
                                    if (tempSelected.length >= 5) return;
                                    setTempSelected([...tempSelected, full]);
                                }
                            }}
                        >
                            {selectedCity.replace("특별시", "")} 전체
                        </button>
                        {districts.map((district) => (
                            <button
                                key={district}
                                className={`block w-full px-3 py-2 text-sm justify-between items-center ${selectedDistrict === district ? "bg-gray-400 text-white rounded-full" : ""}`}
                                onClick={() => setSelectedDistrict(district)}
                            >
                                {district}
                                {selectedDistrict === district && <span className="ml-1">▶</span>}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-y-auto scrollbar-hide">
                        {towns.map((town) => {
                            const full = `${selectedCity} ${selectedDistrict} ${town}`;
                            const selected = tempSelected.includes(full);
                            return (
                                <button
                                    key={town}
                                    onClick={() => toggleTown(town)}
                                    className={`block w-full px-3 py-2 text-sm justify-between items-center ${selected ? "bg-gray-400 text-white rounded-full" : ""}`}
                                >
                                    {town}
                                    {selected && <span>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="text-base pl-2 mt-4 mb-2 text-gray-600">{tempSelected.length}/5</div>
                <div className="flex flex-wrap gap-2 mt-2 pb-6 justify-start border-b border-gray-600 min-h-28">
                    {tempSelected.map((town) => (
                    <span
                        key={town}
                        className="bg-gray-400 text-white text-xs rounded-full px-2 py-1 h-6 flex items-center gap-1"
                    >
                        {town}
                        <button onClick={() => setTempSelected(tempSelected.filter((t) => t !== town))}>✕</button>
                    </span>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <button 
                        className="bg-[#FB4746] text-white text-base font-semibold w-40 py-4 rounded-lg"
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