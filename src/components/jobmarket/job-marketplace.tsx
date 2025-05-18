import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Star,
  Users,
  Clock,
  Globe,
  Award,
  TrendingUp,
  Sliders
} from 'lucide-react';

const JobMarketplace = () => {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [viewMode, setViewMode] = useState('jobs');

  const jobs = {
    permanent: [
      {
        title: "Senior Electronics Engineer",
        company: "TechCorp",
        location: {
          city: "London",
          country: "UK",
          remote: true
        },
        salary: {
          range: "£65,000 - £85,000",
          marketRate: "£75,000",
          regionalRates: {
            "US": "$90,000 - $120,000",
            "EU": "€70,000 - €90,000",
            "Asia": "$45,000 - $65,000"
          }
        },
        requirements: {
          experience: "5+ years",
          certifications: ["Professional Engineer", "IEEE"],
          skills: ["Circuit Design", "PCB Layout", "FPGA"]
        }
      }
    ],
    freelance: [
      {
        title: "PCB Design Project",
        budget: {
          range: "$1,000 - $2,500",
          hourlyRate: "$50-75",
          marketRates: {
            "US": "$75-100",
            "EU": "€60-80",
            "Asia": "$30-50"
          }
        },
        duration: "2 weeks",
        expertise: ["Altium", "High-Speed PCB", "Signal Integrity"],
        verifications: ["Top Rated Plus", "Professional Certification"]
      }
    ]
  };

  const marketInsights = {
    demandLevel: "High",
    competitiveRate: {
      global: "$65/hr",
      regional: {
        "US": "$85/hr",
        "EU": "€70/hr",
        "Asia": "$45/hr"
      }
    },
    skillPremiums: {
      "FPGA": "+20%",
      "RF Design": "+25%",
      "ISO Certification": "+15%"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Job Search Header */}
      <div className="bg-white shadow-sm p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Job title, skills, or company"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Location"
              className="w-64 px-4 py-2 border rounded-lg"
            />
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Search
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('jobs')}
              className={`px-4 py-2 rounded-lg ${
                viewMode === 'jobs' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'text-gray-600'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setViewMode('freelance')}
              className={`px-4 py-2 rounded-lg ${
                viewMode === 'freelance' 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'text-gray-600'
              }`}
            >
              Freelance Projects
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8">
            {viewMode === 'jobs' ? (
              <div className="space-y-6">
                {jobs.permanent.map((job, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">{job.title}</h2>
                        <div className="flex items-center mt-2 text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{job.company}</span>
                          <MapPin className="w-4 h-4 ml-4 mr-1" />
                          <span>{job.location.city}, {job.location.country}</span>
                          {job.location.remote && (
                            <span className="ml-2 text-green-600">(Remote Available)</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{job.salary.range}</div>
                        <div className="text-sm text-gray-500">Market Rate: {job.salary.marketRate}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Requirements</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-4">
                        {job.requirements.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center text-gray-600">
                            <Award className="w-4 h-4 mr-1" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.freelance.map((project, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">{project.title}</h2>
                        <div className="flex items-center mt-2 text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Duration: {project.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{project.budget.range}</div>
                        <div className="text-sm text-gray-500">
                          Hourly Range: {project.budget.hourlyRate}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Required Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.expertise.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-4">
                        {project.verifications.map((verification, idx) => (
                          <div key={idx} className="flex items-center text-green-600">
                            <Star className="w-4 h-4 mr-1" />
                            <span>{verification}</span>
                          </div>
                        ))}
                      </div>
                      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Market Insights Sidebar */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Market Insights
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Select Region</label>
                  <select 
                    className="mt-1 w-full p-2 border rounded-lg"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="global">Global</option>
                    <option value="US">United States</option>
                    <option value="EU">Europe</option>
                    <option value="Asia">Asia</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Competitive Rates</h3>
                  <div className="text-2xl font-bold text-indigo-600">
                    {selectedRegion === 'global' 
                      ? marketInsights.competitiveRate.global
                      : marketInsights.competitiveRate.regional[selectedRegion]}
                  </div>
                  <div className="text-sm text-gray-500">Average rate for this role</div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Skill Premiums</h3>
                  <div className="space-y-2">
                    {Object.entries(marketInsights.skillPremiums).map(([skill, premium]) => (
                      <div key={skill} className="flex justify-between items-center">
                        <span>{skill}</span>
                        <span className="text-green-600">{premium}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Market Demand</h3>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>{marketInsights.demandLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobMarketplace;