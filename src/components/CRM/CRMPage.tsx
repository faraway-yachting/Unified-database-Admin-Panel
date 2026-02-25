"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";
import { useCRM } from "@/context/CRMContext";
import { CRMKPICard } from "./CRMKPICard";
import { CustomerTable, type Customer } from "./CustomerTable";
import { LeadPipeline, type Lead } from "./LeadPipeline";
import { CustomerDetailPanel } from "./CustomerDetailPanel";
import { FollowUpSequences, type Sequence } from "./FollowUpSequences";
import { CustomerSatisfaction, type SurveyResponse } from "./CustomerSatisfaction";
import { SegmentationPanel, type Segment } from "./SegmentationPanel";

const customersData: Customer[] = [
  {
    id: "C-001",
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    email: "michael.chen@email.com",
    region: "Mediterranean",
    totalBookings: 12,
    totalSpent: 48500,
    segment: "VIP",
    lastContact: "Feb 15, 2026",
  },
  {
    id: "C-002",
    name: "Sarah Williams",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    email: "sarah.w@email.com",
    region: "Caribbean",
    totalBookings: 8,
    totalSpent: 35200,
    segment: "VIP",
    lastContact: "Feb 14, 2026",
  },
  {
    id: "C-003",
    name: "James Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    email: "james.r@email.com",
    region: "Pacific",
    totalBookings: 5,
    totalSpent: 18900,
    segment: "Regular",
    lastContact: "Feb 12, 2026",
  },
  {
    id: "C-004",
    name: "Emma Thompson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    email: "emma.t@email.com",
    region: "Mediterranean",
    totalBookings: 15,
    totalSpent: 62300,
    segment: "VIP",
    lastContact: "Feb 18, 2026",
  },
  {
    id: "C-005",
    name: "David Park",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    email: "david.p@email.com",
    region: "Indian Ocean",
    totalBookings: 3,
    totalSpent: 12400,
    segment: "Regular",
    lastContact: "Feb 10, 2026",
  },
  {
    id: "C-006",
    name: "Lisa Anderson",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    email: "lisa.a@email.com",
    region: "Caribbean",
    totalBookings: 1,
    totalSpent: 5400,
    segment: "New",
    lastContact: "Feb 19, 2026",
  },
  {
    id: "C-007",
    name: "Robert Kim",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    email: "robert.k@email.com",
    region: "Pacific",
    totalBookings: 7,
    totalSpent: 28700,
    segment: "Regular",
    lastContact: "Feb 16, 2026",
  },
  {
    id: "C-008",
    name: "Maria Garcia",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    email: "maria.g@email.com",
    region: "Mediterranean",
    totalBookings: 2,
    totalSpent: 8900,
    segment: "New",
    lastContact: "Feb 17, 2026",
  },
];

const leadsData: Lead[] = [
  {
    id: "L-001",
    name: "Alex Turner",
    yachtInterest: "Azure Dream",
    region: "Mediterranean",
    date: "Feb 18",
    status: "new",
  },
  {
    id: "L-002",
    name: "Sophie Martin",
    yachtInterest: "Ocean Majesty",
    region: "Caribbean",
    date: "Feb 17",
    status: "new",
  },
  {
    id: "L-003",
    name: "John Davis",
    yachtInterest: "Twin Seas",
    region: "Pacific",
    date: "Feb 16",
    status: "contacted",
  },
  {
    id: "L-004",
    name: "Nina Patel",
    yachtInterest: "Platinum Wave",
    region: "Indian Ocean",
    date: "Feb 15",
    status: "contacted",
  },
  {
    id: "L-005",
    name: "Tom Wilson",
    yachtInterest: "Wind Chaser",
    region: "Mediterranean",
    date: "Feb 14",
    status: "contacted",
  },
  {
    id: "L-006",
    name: "Julia Brown",
    yachtInterest: "Silver Horizon",
    region: "Caribbean",
    date: "Feb 12",
    status: "quoted",
  },
  {
    id: "L-007",
    name: "Mark Lee",
    yachtInterest: "Sea Harmony",
    region: "Pacific",
    date: "Feb 10",
    status: "quoted",
  },
  {
    id: "L-008",
    name: "Anna Schmidt",
    yachtInterest: "Azure Dream",
    region: "Mediterranean",
    date: "Feb 8",
    status: "converted",
  },
  {
    id: "L-009",
    name: "Carlos Ruiz",
    yachtInterest: "Ocean Majesty",
    region: "Caribbean",
    date: "Feb 5",
    status: "converted",
  },
];

const sequencesData: Sequence[] = [
  {
    id: "S-001",
    name: "Welcome Series",
    trigger: "New customer signup",
    steps: 5,
    activeCustomers: 23,
    isActive: true,
  },
  {
    id: "S-002",
    name: "Post-Booking Follow-up",
    trigger: "Booking completed",
    steps: 3,
    activeCustomers: 45,
    isActive: true,
  },
  {
    id: "S-003",
    name: "Win-Back Campaign",
    trigger: "No booking in 6 months",
    steps: 4,
    activeCustomers: 12,
    isActive: false,
  },
  {
    id: "S-004",
    name: "VIP Exclusive Offers",
    trigger: "VIP segment",
    steps: 6,
    activeCustomers: 8,
    isActive: true,
  },
];

const satisfactionData = {
  avgRating: 4.6,
  responses: [
    {
      id: "R-001",
      customerName: "Michael Chen",
      rating: 5,
      comment:
        "Absolutely amazing experience! The crew was professional and the yacht was pristine.",
      yachtPackage: "Azure Dream - Sunset Experience",
      date: "Feb 15",
    },
    {
      id: "R-002",
      customerName: "Sarah Williams",
      rating: 5,
      comment:
        "Best yacht charter experience ever. Will definitely book again!",
      yachtPackage: "Ocean Majesty - Full Day",
      date: "Feb 12",
    },
    {
      id: "R-003",
      customerName: "James Rodriguez",
      rating: 4,
      comment:
        "Great service overall. Would love more dining options next time.",
      yachtPackage: "Twin Seas - Island Hopping",
      date: "Feb 10",
    },
  ] as SurveyResponse[],
};

const segmentsData: Segment[] = [
  {
    id: "SEG-001",
    name: "VIP Elite",
    customerCount: 24,
    avgSpend: 52300,
    topRegion: "Mediterranean",
    lastCampaign: "Feb 1, 2026",
    color: "#F4A924",
  },
  {
    id: "SEG-002",
    name: "Regular Bookers",
    customerCount: 156,
    avgSpend: 18500,
    topRegion: "Caribbean",
    lastCampaign: "Jan 28, 2026",
    color: "#00C9B1",
  },
  {
    id: "SEG-003",
    name: "New Customers",
    customerCount: 89,
    avgSpend: 6200,
    topRegion: "Pacific",
    lastCampaign: "Feb 5, 2026",
    color: "#10B981",
  },
  {
    id: "SEG-004",
    name: "Inactive (6m+)",
    customerCount: 43,
    avgSpend: 0,
    topRegion: "Indian Ocean",
    lastCampaign: "Feb 10, 2026",
    color: "#6B7280",
  },
  {
    id: "SEG-005",
    name: "Corporate Clients",
    customerCount: 18,
    avgSpend: 42100,
    topRegion: "Mediterranean",
    lastCampaign: "Jan 25, 2026",
    color: "#8B5CF6",
  },
];

export default function CRMPage() {
  const { selectedSegment, searchQuery } = useCRM();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const filteredCustomers = customersData
    .filter((customer) => {
      if (selectedSegment === "All Customers") return true;
      if (selectedSegment === "VIP") return customer.segment === "VIP";
      if (selectedSegment === "Active") return customer.totalBookings > 3;
      if (selectedSegment === "Leads") return false;
      if (selectedSegment === "Churned") return false;
      return true;
    })
    .filter((customer) => {
      if (searchQuery === "") return true;
      const q = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q)
      );
    });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailPanel(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        <CRMKPICard
          icon={Users}
          label="Total Customers"
          value="342"
          change={12}
          sparklineData={[
            { value: 280 },
            { value: 295 },
            { value: 310 },
            { value: 305 },
            { value: 320 },
            { value: 328 },
            { value: 342 },
          ]}
        />
        <CRMKPICard
          icon={UserPlus}
          label="New This Month"
          value="28"
          change={18}
          sparklineData={[
            { value: 15 },
            { value: 18 },
            { value: 22 },
            { value: 20 },
            { value: 24 },
            { value: 26 },
            { value: 28 },
          ]}
        />
        <CRMKPICard
          icon={Target}
          label="Active Leads"
          value="47"
          change={-8}
          sparklineData={[
            { value: 52 },
            { value: 50 },
            { value: 48 },
            { value: 51 },
            { value: 49 },
            { value: 48 },
            { value: 47 },
          ]}
        />
        <CRMKPICard
          icon={Award}
          label="Loyalty Members"
          value="156"
          change={15}
          sparklineData={[
            { value: 125 },
            { value: 132 },
            { value: 140 },
            { value: 145 },
            { value: 148 },
            { value: 152 },
            { value: 156 },
          ]}
        />
        <CRMKPICard
          icon={TrendingUp}
          label="Avg. Satisfaction"
          value="4.6"
          change={5}
          sparklineData={[
            { value: 4.2 },
            { value: 4.3 },
            { value: 4.4 },
            { value: 4.5 },
            { value: 4.5 },
            { value: 4.6 },
            { value: 4.6 },
          ]}
        />
      </div>

      {/* Row 2 - Customer Table + Lead Pipeline */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
        <CustomerTable
          customers={filteredCustomers}
          onView={handleViewCustomer}
          onMessage={(customer) => console.log("Message", customer)}
          onTag={(customer) => console.log("Tag", customer)}
        />
        <LeadPipeline
          leads={leadsData}
          onLeadClick={(lead) => console.log("Lead clicked", lead)}
        />
      </div>

      {/* Row 3 - Customer Detail Panel */}
      {showDetailPanel && (
        <div className="mb-6 md:mb-8">
          <CustomerDetailPanel
            customer={selectedCustomer}
            onClose={() => {
              setShowDetailPanel(false);
              setSelectedCustomer(null);
            }}
          />
        </div>
      )}

      {/* Row 4 - Follow-up Sequences + Customer Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <FollowUpSequences
          sequences={sequencesData}
          onEdit={(seq) => console.log("Edit", seq)}
          onToggle={(seq) => console.log("Toggle", seq)}
          onCreateNew={() => console.log("Create new sequence")}
        />
        <CustomerSatisfaction
          avgRating={satisfactionData.avgRating}
          responses={satisfactionData.responses}
        />
      </div>

      {/* Row 5 - Segmentation Panel */}
      <div>
        <SegmentationPanel
          segments={segmentsData}
          onViewCustomers={(seg) => console.log("View customers", seg)}
          onSendCampaign={(seg) => console.log("Send campaign", seg)}
        />
      </div>
    </div>
  );
}
