
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, User, Clock, AlertCircle, CheckCircle, Filter } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  user: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created: string;
  assigned: string;
  category: string;
}

export const AdminSupport = () => {
  const [tickets] = useState<Ticket[]>([
    {
      id: 'T-001',
      title: 'Probleme beim Job-Upload',
      user: 'Max Mustermann',
      priority: 'high',
      status: 'open',
      created: '2025-01-10 14:30',
      assigned: 'Lisa Weber',
      category: 'Technical'
    },
    {
      id: 'T-002',
      title: 'Zahlung nicht angekommen',
      user: 'Anna Schmidt',
      priority: 'urgent',
      status: 'in_progress',
      created: '2025-01-10 12:15',
      assigned: 'Tom Mueller',
      category: 'Payment'
    },
    {
      id: 'T-003',
      title: 'Account-Verifizierung fehlgeschlagen',
      user: 'Peter Klein',
      priority: 'medium',
      status: 'resolved',
      created: '2025-01-10 09:45',
      assigned: 'Sarah Johnson',
      category: 'Account'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Offene Tickets</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">In Bearbeitung</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Dringend</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Gelöst (heute)</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList>
          <TabsTrigger value="tickets">Ticket Management</TabsTrigger>
          <TabsTrigger value="analytics">Support Analytics</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Support Tickets</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Suche Tickets..." className="w-64" />
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button>Neues Ticket</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={filter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Alle
                </Button>
                <Button 
                  variant={filter === 'open' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('open')}
                >
                  Offen
                </Button>
                <Button 
                  variant={filter === 'in_progress' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('in_progress')}
                >
                  In Bearbeitung
                </Button>
                <Button 
                  variant={filter === 'resolved' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('resolved')}
                >
                  Gelöst
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Titel</TableHead>
                    <TableHead>Nutzer</TableHead>
                    <TableHead>Priorität</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Zugewiesen</TableHead>
                    <TableHead>Erstellt</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.user}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.assigned}</TableCell>
                      <TableCell>{ticket.created}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">Anzeigen</Button>
                          <Button size="sm" variant="outline">Bearbeiten</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Support Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Durchschnittliche Bearbeitungszeit</h3>
                  <p className="text-2xl font-bold text-blue-600">2.4 Stunden</p>
                  <p className="text-sm text-gray-500">-15% vom letzten Monat</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Kundenzufriedenheit</h3>
                  <p className="text-2xl font-bold text-green-600">4.7/5</p>
                  <p className="text-sm text-gray-500">+0.2 vom letzten Monat</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Erste Antwortzeit</h3>
                  <p className="text-2xl font-bold text-orange-600">12 Min</p>
                  <p className="text-sm text-gray-500">-3 Min vom letzten Monat</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>Neuen Artikel erstellen</Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Häufige Probleme</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Job-Upload Probleme</li>
                      <li>• Zahlungsprobleme</li>
                      <li>• Account-Verifizierung</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Neue Artikel</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Karma-System erklärt</li>
                      <li>• Neue Features 2025</li>
                      <li>• Sicherheitsrichtlinien</li>
                    </ul>
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
