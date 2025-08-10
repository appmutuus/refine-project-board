
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, TrendingUp, AlertTriangle, DollarSign, RefreshCw, Download } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: 'payment' | 'payout' | 'refund';
  status: 'completed' | 'pending' | 'failed';
  user: string;
  date: string;
  method: string;
}

export const AdminPayments = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN-001',
      amount: 25.00,
      type: 'payment',
      status: 'completed',
      user: 'Max Mustermann',
      date: '2025-01-10 14:30',
      method: 'Stripe'
    },
    {
      id: 'TXN-002',
      amount: 45.50,
      type: 'payout',
      status: 'pending',
      user: 'Anna Schmidt',
      date: '2025-01-10 12:15',
      method: 'PayPal'
    },
    {
      id: 'TXN-003',
      amount: 15.00,
      type: 'refund',
      status: 'completed',
      user: 'Peter Klein',
      date: '2025-01-10 09:45',
      method: 'Stripe'
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-800';
      case 'payout': return 'bg-blue-100 text-blue-800';
      case 'refund': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Tagesumsatz</p>
                <p className="text-2xl font-bold">€15,420</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Ausstehende Zahlungen</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Rückerstattungen</p>
                <p className="text-2xl font-bold">€450</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Fehlgeschlagene Zahlungen</p>
                <p className="text-2xl font-bold">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transaktionen</TabsTrigger>
          <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
          <TabsTrigger value="reports">Finanzberichte</TabsTrigger>
          <TabsTrigger value="fraud">Betrugserkennung</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Transaktionsverwaltung</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Suche Transaktionen..." className="w-64" />
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button>Manuelle Transaktion</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaktions-ID</TableHead>
                    <TableHead>Betrag</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nutzer</TableHead>
                    <TableHead>Methode</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>€{transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(transaction.type)}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">Details</Button>
                          <Button size="sm" variant="outline">Rückerstattung</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateways">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Verwaltung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Stripe</h3>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Kreditkarten, SEPA</p>
                  <div className="mt-2 text-sm">
                    <p>Transaktionen heute: 1,247</p>
                    <p>Erfolgsrate: 98.2%</p>
                  </div>
                  <Button className="mt-2" variant="outline" size="sm">Konfigurieren</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">PayPal</h3>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <p className="text-sm text-gray-600">PayPal, PayPal Express</p>
                  <div className="mt-2 text-sm">
                    <p>Transaktionen heute: 432</p>
                    <p>Erfolgsrate: 96.8%</p>
                  </div>
                  <Button className="mt-2" variant="outline" size="sm">Konfigurieren</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Finanzberichte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Monatsumsatz</h3>
                  <p className="text-2xl font-bold text-green-600">€425,680</p>
                  <p className="text-sm text-gray-500">+12.5% vom Vormonat</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Durchschn. Transaktionswert</h3>
                  <p className="text-2xl font-bold text-blue-600">€34.20</p>
                  <p className="text-sm text-gray-500">+€2.10 vom Vormonat</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Rückerstattungsrate</h3>
                  <p className="text-2xl font-bold text-orange-600">2.1%</p>
                  <p className="text-sm text-gray-500">-0.3% vom Vormonat</p>
                </div>
              </div>
              <div className="mt-6">
                <Button className="mr-2">
                  <Download className="w-4 h-4 mr-2" />
                  Monatsbericht
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Steuerbericht
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud">
          <Card>
            <CardHeader>
              <CardTitle>Betrugserkennung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg border-red-200 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-red-800">Verdächtige Aktivität erkannt</h3>
                      <p className="text-sm text-red-600">3 Transaktionen von derselben IP in 5 Minuten</p>
                    </div>
                    <Button variant="destructive" size="sm">Untersuchen</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Blockierte Transaktionen</h3>
                    <p className="text-2xl font-bold text-red-600">23</p>
                    <p className="text-sm text-gray-500">Heute</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Risikobewertung</h3>
                    <p className="text-2xl font-bold text-green-600">Niedrig</p>
                    <p className="text-sm text-gray-500">Durchschnittliches Risiko</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Falsch-Positive</h3>
                    <p className="text-2xl font-bold text-orange-600">4.2%</p>
                    <p className="text-sm text-gray-500">Diese Woche</p>
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
