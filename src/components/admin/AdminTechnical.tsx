
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Code, 
  Webhook, 
  Workflow, 
  Database, 
  Bot, 
  Settings, 
  Key,
  Activity,
  Link,
  Mail,
  Zap
} from 'lucide-react';

export const AdminTechnical = () => {
  const [apiKeys] = useState([
    { id: 'api-1', name: 'Mobile App', key: 'pk_live_...', status: 'active', calls: 125430 },
    { id: 'api-2', name: 'Web Dashboard', key: 'pk_test_...', status: 'active', calls: 89234 },
    { id: 'api-3', name: 'Third Party', key: 'pk_dev_...', status: 'inactive', calls: 0 }
  ]);

  const [webhooks] = useState([
    { id: 'wh-1', url: 'https://api.partner.com/webhook', event: 'user.created', status: 'active', success: 98.5 },
    { id: 'wh-2', url: 'https://slack.com/webhook/123', event: 'job.completed', status: 'active', success: 100 },
    { id: 'wh-3', url: 'https://analytics.service.com/hook', event: 'payment.success', status: 'failed', success: 0 }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">API Calls</p>
                <p className="text-2xl font-bold">1.2M</p>
                <p className="text-xs text-green-600">Heute</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Webhook className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Webhooks</p>
                <p className="text-2xl font-bold">847</p>
                <p className="text-xs text-green-600">Versendet</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Workflows</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-blue-600">Aktiv</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">LLM Calls</p>
                <p className="text-2xl font-bold">15.6K</p>
                <p className="text-xs text-green-600">Heute</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="apis" className="w-full">
        <TabsList>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="llm">LLM Integration</TabsTrigger>
          <TabsTrigger value="integrations">Software Interfaces</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>API Verwaltung</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">Dokumentation</Button>
                  <Button>API Key generieren</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aufrufe (30d)</TableHead>
                    <TableHead>Rate Limit</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell className="font-medium">{api.name}</TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {api.key}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge className={api.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {api.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{api.calls.toLocaleString()}</TableCell>
                      <TableCell>1000/h</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Key className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Durchschnittliche Latenz</span>
                    <span className="font-semibold text-green-600">245ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Erfolgsrate</span>
                    <span className="font-semibold text-green-600">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fehlerrate</span>
                    <span className="font-semibold text-red-600">0.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <code>/api/users</code>
                    <span className="text-sm">45.2K calls</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <code>/api/jobs</code>
                    <span className="text-sm">32.1K calls</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <code>/api/payments</code>
                    <span className="text-sm">18.7K calls</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Webhook Verwaltung</CardTitle>
                <Button>
                  <Webhook className="w-4 h-4 mr-2" />
                  Neuer Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erfolgsrate</TableHead>
                    <TableHead>Letzte Ausführung</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="max-w-xs truncate">
                        {webhook.url}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{webhook.event}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={webhook.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {webhook.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{webhook.success}%</TableCell>
                      <TableCell>vor 2 Min</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">Test</Button>
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

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Workflow Builder</CardTitle>
                <Button>
                  <Workflow className="w-4 h-4 mr-2" />
                  Neuer Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Neuer Nutzer Onboarding</h3>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    User registriert → Welcome Email → Profile Setup Reminder → Tutorial Assignment
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span>Trigger: user.created</span>
                    <span>•</span>
                    <span>Ausgeführt: 234x heute</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Job Completion Workflow</h3>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Job abgeschlossen → Zahlung freigeben → Bewertung anfordern → Karma vergeben
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span>Trigger: job.completed</span>
                    <span>•</span>
                    <span>Ausgeführt: 89x heute</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Inaktive Nutzer Reaktivierung</h3>
                    <Badge className="bg-yellow-100 text-yellow-800">Pausiert</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    30 Tage inaktiv → Re-engagement Email → Job Empfehlungen → Support Kontakt
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span>Trigger: user.inactive_30d</span>
                    <span>•</span>
                    <span>Geplant: täglich</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Large Language Model Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">xAI API</h3>
                      <Badge className="bg-green-100 text-green-800">Verbunden</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Heute verwendet:</span>
                        <span>15,643 Tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monatslimit:</span>
                        <span>1M Tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durchschn. Latenz:</span>
                        <span>1.2s</span>
                      </div>
                    </div>
                    <Button size="sm" className="mt-2">Konfigurieren</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">LLM Anwendungen</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Content Generation</span>
                        <Badge variant="outline">Aktiv</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Sentiment Analysis</span>
                        <Badge variant="outline">Aktiv</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Chatbot Responses</span>
                        <Badge variant="outline">Test</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Content Moderation</span>
                        <Badge className="bg-red-100 text-red-800">Deaktiviert</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Prompt Templates</h3>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Job Beschreibung:</strong> "Erstelle eine ansprechende Beschreibung für..."
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Email Template:</strong> "Schreibe eine freundliche E-Mail für..."
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Support Response:</strong> "Antworte höflich auf folgende Anfrage..."
                      </div>
                    </div>
                    <Button size="sm" className="mt-2">Template bearbeiten</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Performance Metriken</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Genauigkeit:</span>
                        <span className="text-green-600 font-semibold">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Antwortzeit:</span>
                        <span className="text-blue-600 font-semibold">1.2s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kosteneinsparung:</span>
                        <span className="text-green-600 font-semibold">€2,340/Monat</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Software Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      <span className="font-semibold">Mailchimp</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verbunden</Badge>
                  </div>
                  <p className="text-sm text-gray-600">E-Mail Marketing Platform</p>
                  <Button size="sm" variant="outline" className="mt-2">Konfigurieren</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      <span className="font-semibold">Slack</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verbunden</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Team Kommunikation</p>
                  <Button size="sm" variant="outline" className="mt-2">Konfigurieren</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Link className="w-5 h-5" />
                      <span className="font-semibold">Zapier</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Konfiguration</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Workflow Automation</p>
                  <Button size="sm" variant="outline" className="mt-2">Einrichten</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      <span className="font-semibold">Google Analytics</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verbunden</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Web Analytics</p>
                  <Button size="sm" variant="outline" className="mt-2">Konfigurieren</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold">Stripe</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verbunden</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Payment Processing</p>
                  <Button size="sm" variant="outline" className="mt-2">Konfigurieren</Button>
                </div>

                <div className="p-4 border rounded-lg border-dashed">
                  <div className="text-center">
                    <span className="text-gray-500">Neue Integration hinzufügen</span>
                    <Button size="sm" className="block mx-auto mt-2">+ Hinzufügen</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation & Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Tägliche Backup Automation</h3>
                    <Badge className="bg-green-100 text-green-800">Läuft</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Automatisches Backup der Datenbank jeden Tag um 02:00 Uhr
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span>Typ: Zeitbasiert</span>
                    <span>•</span>
                    <span>Nächste Ausführung: in 6h 23m</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Report Generation Automation</h3>
                    <Badge className="bg-green-100 text-green-800">Läuft</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Wöchentliche Erstellung und Versendung von Analytics-Reports
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span>Typ: Zeitbasiert</span>
                    <span>•</span>
                    <span>Nächste Ausführung: Sonntag 18:00</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">User Cleanup Automation</h3>
                    <Badge className="bg-yellow-100 text-yellow-800">Pausiert</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Entfernung inaktiver Nutzer nach 365 Tagen Inaktivität
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span>Typ: Eventbasiert</span>
                    <span>•</span>
                    <span>Letzter Lauf: vor 7 Tagen</span>
                  </div>
                </div>

                <Button>
                  <Zap className="w-4 h-4 mr-2" />
                  Neue Automation erstellen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
