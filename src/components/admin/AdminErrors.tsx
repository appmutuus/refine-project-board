
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Bug, Server, Code, TrendingDown } from 'lucide-react';

interface ErrorLog {
  id: string;
  level: 'error' | 'warning' | 'critical';
  message: string;
  source: string;
  count: number;
  lastOccurred: string;
  status: 'open' | 'investigating' | 'resolved';
}

export const AdminErrors = () => {
  const [errors] = useState<ErrorLog[]>([
    {
      id: 'ERR-001',
      level: 'critical',
      message: 'Database connection timeout',
      source: 'API Server',
      count: 12,
      lastOccurred: '2025-01-10 14:30',
      status: 'investigating'
    },
    {
      id: 'ERR-002',
      level: 'error',
      message: 'Payment webhook failed',
      source: 'Payment Service',
      count: 3,
      lastOccurred: '2025-01-10 12:15',
      status: 'open'
    },
    {
      id: 'ERR-003',
      level: 'warning',
      message: 'High memory usage detected',
      source: 'App Server',
      count: 45,
      lastOccurred: '2025-01-10 09:45',
      status: 'resolved'
    }
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-orange-100 text-orange-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Kritische Fehler</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bug className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Offene Fehler</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Fehlerrate</p>
                <p className="text-2xl font-bold">0.02%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="errors" className="w-full">
        <TabsList>
          <TabsTrigger value="errors">Fehlerprotokoll</TabsTrigger>
          <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
          <TabsTrigger value="alerts">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fehlerprotokoll & Bug Tracking</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Suche Fehler..." className="w-64" />
                  <Button variant="outline">Filter</Button>
                  <Button>Fehler melden</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fehler ID</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Nachricht</TableHead>
                    <TableHead>Quelle</TableHead>
                    <TableHead>Anzahl</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Letztes Auftreten</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell className="font-medium">{error.id}</TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(error.level)}>
                          {error.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {error.message}
                      </TableCell>
                      <TableCell>{error.source}</TableCell>
                      <TableCell>{error.count}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(error.status)}>
                          {error.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{error.lastOccurred}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">Details</Button>
                          <Button size="sm" variant="outline">Zuweisen</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>System Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">API Response Time</h3>
                  <p className="text-2xl font-bold text-green-600">245ms</p>
                  <p className="text-sm text-gray-500">Durchschnitt letzte 24h</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Memory Usage</h3>
                  <p className="text-2xl font-bold text-orange-600">72%</p>
                  <p className="text-sm text-gray-500">8.6GB von 12GB</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">CPU Usage</h3>
                  <p className="text-2xl font-bold text-blue-600">45%</p>
                  <p className="text-sm text-gray-500">Durchschnitt</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Database Connections</h3>
                  <p className="text-2xl font-bold text-green-600">23/100</p>
                  <p className="text-sm text-gray-500">Aktive Verbindungen</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Queue Length</h3>
                  <p className="text-2xl font-bold text-yellow-600">145</p>
                  <p className="text-sm text-gray-500">Wartende Jobs</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibolf mb-2">Disk Usage</h3>
                  <p className="text-2xl font-bold text-green-600">34%</p>
                  <p className="text-sm text-gray-500">340GB von 1TB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Benachrichtigungseinstellungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">E-Mail Benachrichtigungen</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Kritische Fehler</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>System Ausfälle</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Performance Warnungen</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Slack Integration</h3>
                  <div className="space-y-2">
                    <Input placeholder="Slack Webhook URL" />
                    <Button size="sm">Test senden</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metriken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">API Endpunkte</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>/api/users</span>
                      <span className="text-green-600">120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>/api/jobs</span>
                      <span className="text-green-600">95ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>/api/payments</span>
                      <span className="text-orange-600">340ms</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Database Queries</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Langsamste Query</span>
                      <span className="text-red-600">2.3s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durchschnitt</span>
                      <span className="text-green-600">45ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Queries/Sekunde</span>
                      <span>234</span>
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
