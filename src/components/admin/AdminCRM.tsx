
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, TrendingUp, Star, Target, Mail, Phone } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'churned';
  segment: string;
  ltv: number;
  lastActivity: string;
  leadScore: number;
}

export const AdminCRM = () => {
  const [customers] = useState<Customer[]>([
    {
      id: 'CRM-001',
      name: 'Max Mustermann',
      email: 'max@example.com',
      phone: '+49 123 456789',
      status: 'active',
      segment: 'Premium',
      ltv: 450,
      lastActivity: '2025-01-10',
      leadScore: 85
    },
    {
      id: 'CRM-002',
      name: 'Anna Schmidt',
      email: 'anna@example.com',
      status: 'active',
      segment: 'Regular',
      ltv: 120,
      lastActivity: '2025-01-09',
      leadScore: 62
    },
    {
      id: 'CRM-003',
      name: 'Peter Klein',
      email: 'peter@example.com',
      phone: '+49 987 654321',
      status: 'inactive',
      segment: 'At-Risk',
      ltv: 80,
      lastActivity: '2024-12-15',
      leadScore: 25
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'churned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Gesamte Kunden</p>
                <p className="text-2xl font-bold">12,547</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Neue Leads</p>
                <p className="text-2xl font-bold">347</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Qualifizierte Leads</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold">23.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList>
          <TabsTrigger value="customers">Kundenverwaltung</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="nurturing">Lead Nurturing</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentierung</TabsTrigger>
          <TabsTrigger value="campaigns">Kampagnen</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Kundendatenbank - 360° Ansicht</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Suche Kunden..." className="w-64" />
                  <Button variant="outline">Filter</Button>
                  <Button>Neuer Kunde</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kunde</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>LTV</TableHead>
                    <TableHead>Lead Score</TableHead>
                    <TableHead>Letzte Aktivität</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.segment}</TableCell>
                      <TableCell>€{customer.ltv}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(customer.leadScore)}`}>
                          {customer.leadScore}
                        </span>
                      </TableCell>
                      <TableCell>{customer.lastActivity}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">Profile</Button>
                          <Button size="sm" variant="outline">Kontakt</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Neu (23)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 border rounded-lg bg-blue-50">
                  <div className="font-semibold text-sm">Acme Corp</div>
                  <div className="text-xs text-gray-500">€5,000 - B2B</div>
                </div>
                <div className="p-2 border rounded-lg bg-blue-50">
                  <div className="font-semibold text-sm">Tech Startup</div>
                  <div className="text-xs text-gray-500">€2,500 - Premium</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Qualifiziert (15)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 border rounded-lg bg-yellow-50">
                  <div className="font-semibold text-sm">Marketing Agency</div>
                  <div className="text-xs text-gray-500">€8,000 - Enterprise</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Proposal (8)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 border rounded-lg bg-orange-50">
                  <div className="font-semibold text-sm">Local Business</div>
                  <div className="text-xs text-gray-500">€1,200 - Standard</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Abgeschlossen (5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 border rounded-lg bg-green-50">
                  <div className="font-semibold text-sm">Enterprise Client</div>
                  <div className="text-xs text-gray-500">€15,000 - Custom</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pipeline Prognosen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Dieser Monat</h3>
                  <p className="text-2xl font-bold text-green-600">€45,000</p>
                  <p className="text-sm text-gray-500">85% Wahrscheinlichkeit</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Nächster Monat</h3>
                  <p className="text-2xl font-bold text-blue-600">€62,000</p>
                  <p className="text-sm text-gray-500">70% Wahrscheinlichkeit</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Quartal</h3>
                  <p className="text-2xl font-bold text-purple-600">€180,000</p>
                  <p className="text-sm text-gray-500">60% Wahrscheinlichkeit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nurturing">
          <Card>
            <CardHeader>
              <CardTitle>Automatisierte Kampagnen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Willkommen Serie</h3>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">5-teilige E-Mail Serie für neue Registrierungen</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>Öffnungsrate: 45%</div>
                    <div>Klickrate: 12%</div>
                    <div>Conversion: 8%</div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Re-Engagement</h3>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Reaktivierung inaktiver Nutzer nach 30 Tagen</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>Öffnungsrate: 22%</div>
                    <div>Klickrate: 8%</div>
                    <div>Conversion: 3%</div>
                  </div>
                </div>

                <Button>Neue Kampagne erstellen</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentation">
          <Card>
            <CardHeader>
              <CardTitle>Benutzer Segmentierung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Premium Nutzer</span>
                      <Badge>1,234 Nutzer</Badge>
                    </div>
                    <p className="text-sm text-gray-500">LTV &gt; €200, Aktiv &gt; 90 Tage</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">At-Risk Nutzer</span>
                      <Badge variant="destructive">567 Nutzer</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Keine Aktivität &gt; 30 Tage</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Neue Nutzer</span>
                      <Badge variant="secondary">2,890 Nutzer</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Registriert &lt; 7 Tage</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Neues Segment erstellen</h3>
                  <div className="space-y-2">
                    <Input placeholder="Segment Name" />
                    <select className="w-full p-2 border rounded">
                      <option>Aktivität basiert</option>
                      <option>Demografisch</option>
                      <option>Behavioral</option>
                    </select>
                    <Button size="sm">Erstellen</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Personalisierte Kampagnen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>Neue Kampagne</Button>
                
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Job Empfehlungen - Premium</h4>
                      <Badge className="bg-green-100 text-green-800">Läuft</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>Zielgruppe: 1,234</div>
                      <div>Gesendet: 1,200</div>
                      <div>Geöffnet: 540 (45%)</div>
                      <div>Geklickt: 144 (12%)</div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Gute Taten Reminder</h4>
                      <Badge className="bg-gray-100 text-gray-800">Geplant</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>Zielgruppe: 5,670</div>
                      <div>Start: Morgen</div>
                      <div>Typ: Push + E-Mail</div>
                      <div>Geplant: 09:00</div>
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
