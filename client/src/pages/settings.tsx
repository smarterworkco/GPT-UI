import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertBusinessSchema, Business, InsertBusiness } from "@shared/schema";
import { Building, Palette, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const colorPresets = [
  { name: "Navy & Gold", primary: "#1e40af", accent: "#f59e0b", key: "navy-gold" },
  { name: "Blue Theme", primary: "#2563eb", accent: "#60a5fa", key: "blue-theme" },
  { name: "Orange Theme", primary: "#c2410c", accent: "#f97316", key: "orange-theme" },
  { name: "Green Theme", primary: "#16a34a", accent: "#22c55e", key: "green-theme" },
  { name: "Purple Theme", primary: "#7c3aed", accent: "#a855f7", key: "purple-theme" },
  { name: "Red Theme", primary: "#dc2626", accent: "#ef4444", key: "red-theme" }
];

export default function Settings() {
  const [selectedColorPreset, setSelectedColorPreset] = useState("navy-gold");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: business } = useQuery<Business>({
    queryKey: ["/api/business"]
  });

  const form = useForm<InsertBusiness>({
    resolver: zodResolver(insertBusinessSchema),
    defaultValues: {
      name: business?.name || "",
      description: business?.description || "",
      industry: business?.industry || "",
      primaryColor: business?.primaryColor || "#4F46E5",
      accentColor: business?.accentColor || "#F59E0B"
    }
  });

  // Update form when business data loads
  React.useEffect(() => {
    if (business) {
      form.reset({
        name: business.name,
        description: business.description || "",
        industry: business.industry || "",
        primaryColor: business.primaryColor || "#4F46E5",
        accentColor: business.accentColor || "#F59E0B"
      });
    }
  }, [business, form]);

  const updateBusinessMutation = useMutation({
    mutationFn: async (data: InsertBusiness) => {
      const response = await apiRequest("PUT", "/api/business", data);
      return response.json() as Promise<Business>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business"] });
      toast({
        title: "Settings saved!",
        description: "Your business profile has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertBusiness) => {
    updateBusinessMutation.mutate(data);
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setSelectedColorPreset(preset.key);
    form.setValue("primaryColor", preset.primary);
    form.setValue("accentColor", preset.accent);
  };

  const handleLogoUpload = () => {
    // Mock logo upload functionality
    toast({
      title: "Logo upload",
      description: "Logo upload functionality would be implemented here."
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Customize your business profile and preferences</p>
        </div>

        <div className="space-y-8">
          {/* Business Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-blue-600" />
                Business Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <Label>Business Logo</Label>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <Button type="button" variant="outline" onClick={handleLogoUpload}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      {...form.register("name")}
                      placeholder="Enter business name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={form.watch("industry")} 
                      onValueChange={(value) => form.setValue("industry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional-services">Professional Services</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      {...form.register("description")}
                      placeholder="Describe your business..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={updateBusinessMutation.isPending}>
                    {updateBusinessMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Brand Colors Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5 text-purple-600" />
                Brand Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Color Presets */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">Color Presets</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorPresets.map((preset) => (
                    <div
                      key={preset.key}
                      className={cn(
                        "border-2 rounded-xl p-4 cursor-pointer transition-colors duration-200",
                        selectedColorPreset === preset.key 
                          ? "border-primary bg-gray-50" 
                          : "border-transparent hover:border-gray-300"
                      )}
                      onClick={() => applyColorPreset(preset)}
                    >
                      <div className="flex gap-2 mb-3">
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{preset.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="color"
                      value={form.watch("primaryColor")}
                      onChange={(e) => form.setValue("primaryColor", e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={form.watch("primaryColor")}
                      onChange={(e) => form.setValue("primaryColor", e.target.value)}
                      placeholder="#4F46E5"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Accent Color</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="color"
                      value={form.watch("accentColor")}
                      onChange={(e) => form.setValue("accentColor", e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={form.watch("accentColor")}
                      onChange={(e) => form.setValue("accentColor", e.target.value)}
                      placeholder="#F59E0B"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={updateBusinessMutation.isPending}
                >
                  {updateBusinessMutation.isPending ? "Applying..." : "Apply Colors"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
