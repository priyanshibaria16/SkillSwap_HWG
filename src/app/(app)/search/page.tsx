"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillCard } from "@/components/pages/search/skill-card";
import { ListFilter, SearchIcon } from "lucide-react";

// Placeholder data for skills/tutors
const skillsData = [
  {
    id: "1",
    name: "Advanced Pottery Techniques",
    tutor: "Alice Wonderland",
    rating: 4.8,
    price: "₹150/session",
    image: "https://img.freepik.com/free-photo/mother-with-daughter-makes-vase-potterystudio_1157-36640.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740",
    category: "Crafts",
    dataAiHint: "pottery craft",
  },
  {
    id: "2",
    name: "Conversational Spanish",
    tutor: "Bob The Builder",
    rating: 4.5,
    price: "Barter",
    image: "https://img.freepik.com/free-photo/learn-spanish-language-online-education-concept_53876-132596.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740",
    category: "Language",
    dataAiHint: "language learning",
  },
  {
    id: "3",
    name: "Introduction to Web Development",
    tutor: "Charlie Brown",
    rating: 4.9,
    price: "₹200/session",
    image: "https://img.freepik.com/free-vector/web-development-seo-concept-design-cartoon-character-flat-style_1362-164.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740",
    category: "Tech",
    dataAiHint: "coding programming",
  },
  {
    id: "4",
    name: "Yoga for Beginners",
    tutor: "Diana Prince",
    rating: 4.7,
    price: "₹100/session",
    image: "https://img.freepik.com/free-vector/flat-online-yoga-class-concept_23-2148555872.jpg?uid=R140942659&ga=GA1.1.585428745.1748396871&semt=ais_hybrid&w=740",
    category: "Wellness",
    dataAiHint: "yoga fitness",
  },
];

export default function SearchPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Temporary preview
      setUploadedImage(imageUrl);
    }
  }

  return (
    <div>
      <PageHeader
        title="Find Your Next Skill"
        description="Explore a wide variety of skills and connect with talented tutors."
      />

      {/* Image Upload Section */}
      <div className="my-6 p-4 border rounded-lg bg-muted">
        <label className="block mb-2 font-semibold">Upload Skill Image</label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploadedImage && (
          <div className="mt-4">
            <img
              src={uploadedImage}
              alt="Uploaded Preview"
              className="w-48 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      {/* Search Bar and Filters */}
      <div className="mb-6 p-4 border rounded-lg bg-card shadow">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for skills, tutors, or categories..."
              className="w-full pl-10 pr-4 py-2 h-11 text-base"
            />
          </div>
          <Button size="lg" className="w-full md:w-auto h-11">
            <SearchIcon className="mr-2 h-4 w-4 sm:hidden" /> Search
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Select>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crafts">Crafts</SelectItem>
              <SelectItem value="language">Language</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="wellness">Wellness</SelectItem>
              <SelectItem value="music">Music</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="barter">Barter</SelectItem>
              <SelectItem value="50-100">₹50-₹100</SelectItem>
              <SelectItem value="100-150">₹100-₹150</SelectItem>
              <SelectItem value="150-200">₹150-₹200</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="gujarati">Gujarati</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" /> Advanced Filters
          </Button>
        </div>
      </div>

      {/* Skill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skillsData.map((skill) => (
          <SkillCard key={skill.id} {...skill} />
        ))}
      </div>

      {/* No Results Message */}
      {skillsData.length === 0 && (
        <div className="text-center py-10">
          <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No skills found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
