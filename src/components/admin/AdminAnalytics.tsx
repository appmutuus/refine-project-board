
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, TrendingUp, Activity, Download, Calendar } from 'lucide-react';

export const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDateRange('24h')}>
            24h
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDateRange('7d')}>
            7 Tage
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDateRange('30d')}>
            30 Tage
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Daily Active Users</p>
                <p className="text-2xl font-bold">24,532</p>
                <p className="text-xs text-green-600">+12.5% vs gestern</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Session Duration</p>
                <p className="text-2xl font-bold">8m 34s</p>
                <p className="text-xs text-green-600">+2.1% vs gestern</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold">3.2%</p>
                <p className="text-xs text-red-600">-0.3% vs gestern</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Page Views</p>
                <p className="text-2xl font-bold">156K</p>
                <p className="text-xs text-green-600">+8.7% vs gestern</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User-Verhalten</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="abtest">A/B Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Jobs durchsucht</span>
                    <span className="font-semibold">89.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Profile bearbeitet</span>
                    <span className="font-semibold">34.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Jobs bewertet</span>
                    <span className="font-semibold">12.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gute Taten</span>
                    <span className="font-semibold">8.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demografische Daten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Alter</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>18-24</span>
                        <span>28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>25-34</span>
                        <span>42%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>35-44</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>45+</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Seiten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 border rounded">
                  <span>/dashboard</span>
                  <div className="flex items-center gap-2">
                    <Badge>45,234 views</Badge>
                    <span className="text-sm text-gray-500">Ø 4m 12s</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span>/jobs</span>
                  <div className="flex items-center gap-2">
                    <Badge>32,123 views</Badge>
                    <span className="text-sm text-gray-500">Ø 6m 45s</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span>/profile</span>
                  <div className="flex items-center gap-2">
                    <Badge>18,567 views</Badge>
                    <span className="text-sm text-gray-500">Ø 3m 22s</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kampagnen Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Facebook Ads - Job Suche</h4>
                      <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>Impressions: 45K</div>
                      <div>Clicks: 1.2K</div>
                      <div>CTR: 2.7%</div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Google Ads - Gute Taten</h4>
                      <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>Impressions: 23K</div>
                      <div>Clicks: 890</div>
                      <div>CTR: 3.9%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Akquisition Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Organic Search</span>
                    <span className="font-semibold">45.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Social Media</span>
                    <span className="font-semibold">28.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Direct</span>
                    <span className="font-semibold">15.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Paid Ads</span>
                    <span className="font-semibold">8.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Referral</span>
                    <span className="font-semibold">1.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>User Retention Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">1-Tag Retention</h3>
                  <p className="text-2xl font-bold text-blue-600">72%</p>
                  <p className="text-sm text-gray-500">+3% vom Vormonat</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">7-Tage Retention</h3>
                  <p className="text-2xl font-bold text-green-600">34%</p>
                  <p className="text-sm text-gray-500">+1.5% vom Vormonat</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">30-Tage Retention</h3>
                  <p className="text-2xl font-bold text-orange-600">18%</p>
                  <p className="text-sm text-gray-500">-0.8% vom Vormonat</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Monthly Recurring Revenue</h3>
                  <p className="text-2xl font-bold text-green-600">€89,450</p>
                  <p className="text-sm text-gray-500">+12.3% MoM Growth</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Customer Lifetime Value</h3>
                  <p className="text-2xl font-bold text-blue-600">€127</p>
                  <p className="text-sm text-gray-500">Durchschnittlich</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abtest">
          <Card>
            <CardHeader>
              <CardTitle>A/B Test Verwaltung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>Neuen Test erstellen</Button>
                
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Dashboard Layout Test</h4>
                      <Badge className="bg-green-100 text-green-800">Läuft</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Variante A: 48.2% Conversion</div>
                      <div>Variante B: 52.7% Conversion</div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">CTA Button Farbe</h4>
                      <Badge className="bg-gray-100 text-gray-800">Beendet</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Blau: 32.1% Conversion</div>
                      <div>Grün: 35.8% Conversion (Gewinner)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
