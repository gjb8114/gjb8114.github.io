'use client';

import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {getRuleUri, Rule} from '@/lib/rules';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {cn} from "@/lib/utils";
import {SeverityBadge} from "@/components/SeverityBadge";

interface SidebarProps {
  features: Rule[];
  currentId?: string;
  activeCategory?: 'common' | 'cpp';
}

export default function Sidebar({
  features,
  currentId,
  activeCategory
}: SidebarProps) {
  // Group features by subcategory
  const categories: Record<string, Rule[]> = {};

  // Filter features by the active main category if specified
  const filteredFeatures = activeCategory
    ? features.filter(feature => feature.part === activeCategory)
    : features;

  // Group by subcategory
  filteredFeatures.forEach(rule => {
    if (!categories[rule.category]) categories[rule.category] = [];
    categories[rule.category].push(rule);
  });

  // Create refs for scrolling
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  // Find which category contains the current rule
  const currentCategory = filteredFeatures.find(
    feature => feature.id === currentId
  )?.category || '';

  // For controlled accordion state
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  // Auto-expand the subcategory containing the current rule and scroll to it
  useEffect(() => {
    if (currentId && currentCategory) {
      // Expand the subcategory containing the current rule
      setOpenCategories(prev => {
        if (!prev.includes(currentCategory)) {
          return [...prev, currentCategory];
        }
        return prev;
      });

      // Scroll to the active item after a small delay to ensure the DOM has updated
      setTimeout(() => {
        if (activeItemRef.current && sidebarRef.current) {
          sidebarRef.current.scrollTo({
            top: activeItemRef.current.offsetTop - sidebarRef.current.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [currentId, currentCategory]);

  // Handle accordion value change
  const handleAccordionChange = (value: string[]) => {
    setOpenCategories(value);
  };

  return (
    <aside className="w-64 h-screen overflow-auto bg-background border-r border-border shadow-sm hidden md:block fixed" ref={sidebarRef}>
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="p-4">
          <div className="flex space-x-2 mt-2 text-sm">
            <Link
              href="/rules/common"
              className={cn(
                "px-3 py-1 rounded-md transition-colors",
                activeCategory === 'common'
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              C/C++ 准则
            </Link>
            <Link
              href="/rules/cpp"
              className={cn(
                "px-3 py-1 rounded-md transition-colors",
                activeCategory === 'cpp'
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              C++ 准则
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <nav className="px-4 pb-4">
          <Accordion
            type="multiple"
            value={openCategories}
            onValueChange={handleAccordionChange}
            className="space-y-1"
          >
            {Object.keys(categories).sort().map((subCategory) => {
              const subCategoryFeatures = categories[subCategory];

              return (
                <AccordionItem
                  key={subCategory}
                  value={subCategory}
                  className="border-none"
                >
                  <AccordionTrigger className="py-2 px-2 hover:bg-muted hover:no-underline rounded-md text-sm">
                    {subCategory}
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <div className="ml-2 border-l border-border pl-2 space-y-1 mt-1">
                      {subCategoryFeatures.map((rule) => {
                        const isActive = currentId === rule.id;

                        return (
                          <Link
                            key={rule.id}
                            href={getRuleUri(rule)}
                            className={cn(
                              "block px-3 py-1 rounded-md transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted"
                            )}
                            ref={isActive ? activeItemRef : null}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <SeverityBadge severity={rule.severity} size="xs"/>
                                <span className="font-semibold text-sm">{rule.id.toUpperCase()}</span>
                              </div>
                              <span className="text-xs">{rule.title}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>
      </div>
    </aside>
  );
}
