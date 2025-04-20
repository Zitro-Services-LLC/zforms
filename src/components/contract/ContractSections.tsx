
import React from 'react';

interface ContractSection {
  id: number;
  title: string;
  content: string;
}

interface ContractSectionsProps {
  sections: ContractSection[];
}

const ContractSections: React.FC<ContractSectionsProps> = ({ sections }) => {
  return (
    <div className="px-6">
      {sections.map((section) => (
        <div key={section.id} className="document-section">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
          <div className="text-base text-gray-700 whitespace-pre-line">{section.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ContractSections;
