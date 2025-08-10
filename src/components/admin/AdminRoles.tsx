
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Users, Lock, Key, Eye, UserPlus, Settings } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  status: 'active' | 'inactive';
}

interface Permission {
  module: string;
  actions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export const AdminRoles = () => {
  const [roles] = useState<Role[]>([
    {
      id: 'role-1',
      name: 'Super Admin',
      description: 'Vollzugriff auf alle Funktionen',
      users: 2,
      permissions: ['all'],
      status: 'active'
    },
    {
      id: 'role-2',
      name: 'Support Agent',
      description: 'Zugriff auf Support und Tickets',
      users: 15,
      permissions: ['support.view', 'support.edit', 'tickets.all'],
      status: 'active'
    },
    {
      id: 'role-3',
      name: 'Marketing Manager',
      description: 'Kampagnen und Analytics',
      users: 8,
      permissions: ['analytics.view', 'campaigns.all', 'crm.view'],
      status: 'active'
    },
    {
      id: 'role-4',
      name: 'Developer',
      description: 'Technische Integrationen',
      users: 5,
      permissions: ['api.all', 'webhooks.all', 'workflows.all'],
      status: 'active'
    }
  ]);

  const [permissions] = useState<Permission[]>([
    {
      module: 'Support',
      actions: { view: true, create: true, edit: true, delete: false }
    },
    {
      module: 'Zahlungen',
      actions: { view: true, create: false, edit: true, delete: false }
    },
    {
      module: 'Analytics',
      actions: { view: true, create: false, edit: false, delete: false }
    },
    {
      module: 'CRM',
      actions: { view: true, create: true, edit: true, delete: true }
    },
    {
      module: 'Technik',
      actions: { view: true, create: true, edit: true, delete: true }
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Aktive Rollen</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Zugewiesene Nutzer</p>
                <p className="text-2xl font-bold">147</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Berechtigungen</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Sicherheitsverletzungen</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles">Rollenverwaltung</TabsTrigger>
          <TabsTrigger value="permissions">Berechtigungen</TabsTrigger>
          <TabsTrigger value="users">Nutzerzuweisung</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Rollen & Zugriffskontrolle</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Suche Rollen..." className="w-64" />
                  <Button>
                    <Shield className="w-4 h-4 mr-2" />
                    Neue Rolle
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rolle</TableHead>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead>Nutzer</TableHead>
                    <TableHead>Berechtigungen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {role.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.users} Nutzer</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 2).map((perm, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                          {role.permissions.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{role.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {role.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <UserPlus className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Berechtigungsmatrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Modul</th>
                      <th className="text-center p-3 font-semibold">Anzeigen</th>
                      <th className="text-center p-3 font-semibold">Erstellen</th>
                      <th className="text-center p-3 font-semibold">Bearbeiten</th>
                      <th className="text-center p-3 font-semibold">Löschen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{permission.module}</td>
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={permission.actions.view}
                            className="w-4 h-4"
                            readOnly
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={permission.actions.create}
                            className="w-4 h-4"
                            readOnly
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={permission.actions.edit}
                            className="w-4 h-4"
                            readOnly
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={permission.actions.delete}
                            className="w-4 h-4"
                            readOnly
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Button>Berechtigungen speichern</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Nutzerzuweisung zu Rollen</CardTitle>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nutzer zuweisen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Super Admin (2 Nutzer)</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>admin@mutuus.com</span>
                      <Button size="sm" variant="outline">Entfernen</Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>cto@mutuus.com</span>
                      <Button size="sm" variant="outline">Entfernen</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Support Agent (15 Nutzer)</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>support1@mutuus.com</span>
                      <Button size="sm" variant="outline">Entfernen</Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>support2@mutuus.com</span>
                      <Button size="sm" variant="outline">Entfernen</Button>
                    </div>
                    <div className="text-sm text-gray-500 p-2">
                      ... und 13 weitere
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log - Berechtigungsänderungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Rolle "Marketing Manager" bearbeitet</span>
                      <p className="text-sm text-gray-500">
                        admin@mutuus.com hat Analytics-Berechtigung hinzugefügt
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">vor 2 Stunden</span>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Nutzer "support3@mutuus.com" zugewiesen</span>
                      <p className="text-sm text-gray-500">
                        Zur Rolle "Support Agent" hinzugefügt
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">vor 1 Tag</span>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">Neue Rolle "Content Editor" erstellt</span>
                      <p className="text-sm text-gray-500">
                        admin@mutuus.com hat neue Rolle mit Content-Berechtigungen erstellt
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">vor 3 Tagen</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sicherheitseinstellungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Multi-Faktor-Authentifizierung</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>MFA für Super Admin erforderlich</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>MFA für alle Admin-Rollen empfohlen</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Session Management</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Session Timeout:</span>
                      <select className="border rounded px-2 py-1">
                        <option>15 Minuten</option>
                        <option>30 Minuten</option>
                        <option>1 Stunde</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Max. gleichzeitige Sessions:</span>
                      <Input type="number" defaultValue="3" className="w-20" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">IP-Beschränkungen</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>IP-Whitelist für Admin-Zugang aktivieren</span>
                    </label>
                    <Input placeholder="Erlaubte IP-Adressen (kommagetrennt)" />
                  </div>
                </div>

                <Button>Sicherheitseinstellungen speichern</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
