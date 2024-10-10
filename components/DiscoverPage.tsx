"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TalentDetailsPopup from '@/components/TalentDetailsPopup';
import FeaturedCarousel from '@/components/FeaturedCarousel';

const DiscoverPage: React.FC = () => {
  const [talents, setTalents] = useState([]);
  const [filter, setFilter] = useState('alphabetical');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [isFreeFilter, setIsFreeFilter] = useState(false);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const response = await fetch('/api/talents');
        const data = await response.json();
        setTalents(data);
      } catch (error) {
        console.error('Error fetching talents:', error);
      }
    };

    fetchTalents();
  }, []);

  const filteredTalents = talents.filter(talent =>
    (isFreeFilter ? talent.price === 0 : true) &&
    (talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    talent.role.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    if (filter === 'new') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Default alphabetical order
      return a.name.localeCompare(b.name);
    }
  });

  const handleTalentClick = (talent) => {
    setSelectedTalent(talent);
  };

  const toggleFreeFilter = () => {
    setIsFreeFilter(!isFreeFilter);
  };

  const toggleNewFilter = () => {
    setFilter(filter === 'new' ? 'alphabetical' : 'new');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FeaturedCarousel talents={talents.slice(0, 5)} onTalentClick={handleTalentClick} />
      
      <h2 className="text-2xl font-bold mt-12 mb-4">Discover Talent</h2>
      <div className="flex gap-4 mb-6">
        <Button 
          variant={filter === 'new' ? "default" : "outline"}
          onClick={toggleNewFilter}
        >
          New
        </Button>
        <Button 
          variant={isFreeFilter ? "default" : "outline"}
          onClick={toggleFreeFilter}
        >
          Free
        </Button>
        <Input
          type="text"
          placeholder="Search by name, skill, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTalents.map((talent) => (
          <Card key={talent._id} className="cursor-pointer" onClick={() => handleTalentClick(talent)}>
            <CardContent className="p-4">
              <img
                src={talent.image}
                alt={talent.name}
                className="w-full h-36 object-cover mb-4 rounded-md"
              />
              <h3 className="font-semibold text-lg">{talent.name}</h3>
              <p className="text-sm text-muted-foreground">{talent.role}</p>
              <div className="flex justify-between text-sm mt-2">
                <span>{talent.age ? `${talent.age} years` : 'N/A'}</span>
                <span>{talent.price === 0 ? "Free" : `$${talent.price}`}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TalentDetailsPopup
        talent={selectedTalent}
        isOpen={!!selectedTalent}
        onClose={() => setSelectedTalent(null)}
      />
    </div>
  );
};

export default DiscoverPage;