import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { FileText, Users, MessageSquare, TrendingUp, Download, Eye } from "lucide-react";

const AdminDashboard = () => {
  // Mock statistics - would come from backend
  const stats = [
    {
      label: "Total Resources",
      value: "147",
      change: "+12 this week",
      icon: FileText,
      color: "text-admin-accent",
      bgColor: "bg-admin-accent/20",
    },
    {
      label: "Total Downloads",
      value: "2,341",
      change: "+234 this week",
      icon: Download,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      label: "Page Views",
      value: "8,492",
      change: "+1,042 this week",
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
    {
      label: "Pending Suggestions",
      value: "23",
      change: "5 new today",
      icon: MessageSquare,
      color: "text-orange-500",
      bgColor: "bg-orange-500/20",
    },
  ];

  const recentActivity = [
    { action: "New suggestion received", resource: "Algorithm Notes", time: "2 hours ago" },
    { action: "File uploaded", resource: "CS101 Final Exam 2024", time: "4 hours ago" },
    { action: "Link added", resource: "Introduction to ML Book", time: "1 day ago" },
    { action: "Resource deleted", resource: "Outdated Slides", time: "2 days ago" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-admin-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-admin-foreground/60">
            Overview of your academic resource platform
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-admin-card border-admin-border p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-admin-foreground/60 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-admin-foreground mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-admin-foreground/40 mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="bg-admin-card border-admin-border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-admin-foreground mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-admin-border last:border-0"
                >
                  <div>
                    <p className="text-admin-foreground font-medium">
                      {activity.action}
                    </p>
                    <p className="text-sm text-admin-foreground/60">
                      {activity.resource}
                    </p>
                  </div>
                  <span className="text-sm text-admin-foreground/40">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-admin-card border-admin-border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-admin-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-admin-background rounded-lg hover:bg-admin-accent/20 transition-colors text-left">
                <FileText className="w-5 h-5 text-admin-accent mb-2" />
                <p className="font-medium text-admin-foreground">Upload Resource</p>
                <p className="text-sm text-admin-foreground/60">Add new study materials</p>
              </button>
              
              <button className="p-4 bg-admin-background rounded-lg hover:bg-admin-accent/20 transition-colors text-left">
                <MessageSquare className="w-5 h-5 text-admin-accent mb-2" />
                <p className="font-medium text-admin-foreground">Review Suggestions</p>
                <p className="text-sm text-admin-foreground/60">23 pending</p>
              </button>
              
              <button className="p-4 bg-admin-background rounded-lg hover:bg-admin-accent/20 transition-colors text-left">
                <TrendingUp className="w-5 h-5 text-admin-accent mb-2" />
                <p className="font-medium text-admin-foreground">View Analytics</p>
                <p className="text-sm text-admin-foreground/60">Detailed insights</p>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;