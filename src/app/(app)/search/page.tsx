
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkillCard } from "@/components/pages/search/skill-card";
import { Filter, ListFilter, SearchIcon } from "lucide-react";

// Placeholder data for skills/tutors
const allSkillsData = [
  { id: "1", name: "Advanced Pottery Techniques", tutor: "Alice Wonderland", rating: 4.8, price: "₹150/session", image: "https://img.freepik.com/free-photo/mother-with-daughter-makes-vase-potterystudio_1157-36640.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Crafts", dataAiHint: "pottery craft" },
  { id: "2", name: "Conversational Spanish", tutor: "Bob The Builder", rating: 4.5, price: "Barter", image: "https://img.freepik.com/free-photo/learn-spanish-language-online-education-concept_53876-132596.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Language", dataAiHint: "language learning" },
  { id: "3", name: "Introduction to Web Development", tutor: "Charlie Brown", rating: 4.9, price: "₹200/session", image: "https://img.freepik.com/free-vector/web-development-seo-concept-design-cartoon-character-flat-style_1362-164.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Tech", dataAiHint: "coding programming" },
  { id: "4", name: "Yoga for Beginners", tutor: "Diana Prince", rating: 4.7, price: "₹100/session", image: "https://img.freepik.com/free-vector/flat-online-yoga-class-concept_23-2148555872.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Wellness", dataAiHint: "yoga fitness" },
  { id: "5", name: "Digital Marketing Fundamentals", tutor: "Edward Scissorhands", rating: 4.6, price: "₹120/session", image: "https://img.freepik.com/free-photo/digital-marketing-with-icons-business-people_53876-94833.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Tech", dataAiHint: "marketing computer" },
  { id: "6", name: "Gourmet Baking Masterclass", tutor: "Fiona Gallagher", rating: 4.9, price: "Barter", image: "https://img.freepik.com/premium-photo/concept-sweet-food-tasty-chocolate-pancakes_185193-96540.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740", category: "Crafts", dataAiHint: "baking cake" },
];


export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedSkills, setDisplayedSkills] = useState(allSkillsData);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  // Placeholder states for other filters, can be activated later
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const parsePrice = (priceStr: string): number | 'Barter' => {
    if (priceStr.toLowerCase() === "barter") {
      return "Barter";
    }
    const match = priceStr.match(/₹(\d+)/);
    return match ? parseInt(match[1], 10) : NaN;
  };

  useEffect(() => {
    let filtered = allSkillsData;

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(lowercasedQuery) ||
        skill.tutor.toLowerCase().includes(lowercasedQuery) ||
        skill.category.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    // Filter by price range
    if (selectedPriceRange && selectedPriceRange !== "all") {
      if (selectedPriceRange === "barter") {
        filtered = filtered.filter(skill => skill.price.toLowerCase() === "barter");
      } else {
        const [minStr, maxStr] = selectedPriceRange.split('-');
        const minPrice = parseInt(minStr, 10);
        const maxPrice = parseInt(maxStr, 10);
        
        filtered = filtered.filter(skill => {
          const priceValue = parsePrice(skill.price);
          if (typeof priceValue === 'number') {
            return priceValue >= minPrice && priceValue <= maxPrice;
          }
          return false; // Exclude "Barter" items if a numeric range is selected
        });
      }
    }
    
    // TODO: Implement location and language filters when data supports it

    setDisplayedSkills(filtered);
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedLocation, selectedLanguage]);

  const handleSearchFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // The useEffect already handles filtering when searchQuery changes,
    // so this form submission can be simplified or just ensure searchQuery state is up-to-date.
    // For direct button click effect, you could re-trigger the logic, but useEffect covers it.
  };

  return (
    <div>
      <PageHeader
        title="Find Your Next Skill"
        description="Explore a wide variety of skills and connect with talented tutors."
      />
      <div className="mb-6 p-4 border rounded-lg bg-card shadow">
        <form onSubmit={handleSearchFormSubmit} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for skills, tutors, or categories..."
              className="w-full pl-10 pr-4 py-2 h-11 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search skills"
            />
          </div>
          <Button type="submit" size="lg" className="w-full md:w-auto h-11">
            <SearchIcon className="mr-2 h-4 w-4 sm:hidden" /> Search
          </Button>
        </form>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10" aria-label="Filter by category">
              <SelectValue placeholder="Category (All)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Crafts">Crafts</SelectItem>
              <SelectItem value="Language">Language</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Wellness">Wellness</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
            <SelectTrigger className="h-10" aria-label="Filter by price range">
              <SelectValue placeholder="Price Range (All)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="barter">Barter</SelectItem>
              <SelectItem value="50-100">₹50-₹100</SelectItem>
              <SelectItem value="100-150">₹100-₹150</SelectItem>
              <SelectItem value="150-200">₹150-₹200</SelectItem>
               <SelectItem value="201-9999">₹200+</SelectItem> {/* Example for above 200 */}
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled>
            <SelectTrigger className="h-10" aria-label="Filter by location (disabled)">
              <SelectValue placeholder="Location (All)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled>
            <SelectTrigger className="h-10" aria-label="Filter by language (disabled)">
              <SelectValue placeholder="Language (All)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="gujarati">Gujarati</SelectItem>
            </SelectContent>
          </Select>
        </div>
         <div className="mt-4 flex justify-end">
            <Button variant="outline" disabled>
                <ListFilter className="mr-2 h-4 w-4" /> Advanced Filters (Not Implemented)
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedSkills.map((skill) => (
          <SkillCard key={skill.id} {...skill} />
        ))}
      </div>
      {displayedSkills.length === 0 && (
        <div className="text-center py-10 col-span-full">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No skills found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
