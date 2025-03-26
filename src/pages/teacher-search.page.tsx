import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import NewTeacherCard from "@/components/cards/teacher-card.component";
import NewTeacherDetails from "@/components/teacher-details/new-teacher-details.component";
import { getTeachers, getTeachersBySubject, getTeachersByName } from "@/utils/supabase/supabase.utils";
import { IProfile } from "@/api/types";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/auth/auth.selector";
import BaseButton, { buttonType } from "@/components/buttons/base-button.component";
import AbsoluteLoaderLayout from "@/components/loader/absolute-loader-layout.component";

type SearchMode = "subject" | "name";

const TeacherSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<IProfile[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<IProfile[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>("subject");
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector(selectCurrentUser);

  // Fetch teacher profiles from Supabase on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      const data = await getTeachers();
      if (data) {
        setTeachers(data);
        setFilteredTeachers(data);
        setSelectedTeacherId(data[0]?.user_id || null);
      }
      setIsLoading(false);
    };
    fetchTeachers();
  }, []);

  // Trigger search when user clicks Search
  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setFilteredTeachers(teachers);
      return;
    }
    setIsLoading(true);
    let results: IProfile[] | null = null;
    if (searchMode === "subject") {
      results = await getTeachersBySubject(query);
    } else {
      results = await getTeachersByName(query);
    }
    setFilteredTeachers(results || []);
    setSelectedTeacherId(null);
    setIsLoading(false);
  };

  return (
    <>
      {currentUser.user && (
        <div className="min-h-screen w-full h-full relative">
            {/* Main Content */}
            <div className="flex min-h-screen">
              {/* Main Content Area */}
              <div className="flex-1 p-6">
                {/* Search Bar */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-2 mb-6">
                  <div className="flex-1 relative w-full">
                    <Search className="absolute left-4 top-3 h-5 w-5 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Search subjects or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-200 text-black pl-12 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                  </div>

                  {/* Toggle for search mode */}
                  <div className="flex items-center justify-stretch gap-3">
                    <BaseButton rounded={false}
                      className={` !px-4 !text-xs ${searchMode === "subject" ? "!bg-purple-600 !text-white" : "!bg-gray-200 !text-black"
                        }`}
                      clickHandler={() => setSearchMode("subject")}
                    >
                      By Subject
                    </BaseButton>
                    <BaseButton rounded={false}
                      className={`!px-4 !text-xs ${searchMode === "name" ? "!bg-purple-600 !text-white" : "!bg-gray-200 !text-black"
                        }`}
                      clickHandler={() => setSearchMode("name")}
                    >
                      By Name
                    </BaseButton>

                    <BaseButton
                      clickHandler={handleSearch}
                      className="!text-xs !px-4"
                      rounded={false}
                      type={buttonType.dark}
                    >
                      Search
                    </BaseButton>
                  </div>
                </div>

                {/* Search Results Header */}
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-black text-xl">Search Results</h2>
                  <span className="text-gray-700">{filteredTeachers.length} results found</span>
                </div>

                {/* Teacher Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredTeachers.map((profile) => (
                    <NewTeacherCard
                      key={profile.user_id}
                      teacherId={profile.user_id}
                      onClick={() => setSelectedTeacherId(profile.user_id)}
                      isSelected={selectedTeacherId === profile.user_id}
                    />
                  ))}
                </div>
              </div>

              {/* Teacher Details Sidebar */}
              <div className="hidden md:inline-block md:w-1/2 lg:w-1/3 border-l p-1 border-gray-200 bg-gray-200/60 min-h-[80svh]">
                {selectedTeacherId && (
                  <NewTeacherDetails className="h-full rounded-sm overflow-hidden" teacherId={selectedTeacherId} />
                )}
              </div>
            </div>
          {isLoading && (<AbsoluteLoaderLayout /> )}
        </div>
      )}
    </>
  );
};

export default TeacherSearchPage;
