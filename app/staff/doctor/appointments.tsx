"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Appointment {
  id: number;
  patientId: number;
  date: string;
  time: string;
  action: {
    appointmentType: {
      id: number;
      type: string;
    };
  };
  status: {
    id: number;
    status: string;
  };
  patient: Patient;
}

interface Patient {
  id: number;
  user: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    sex: {
      gender: string;
    };
  };
  medicalHistory?: string;
}

interface Payment {
  id: number;
  amount: number;
  date: string;
  time: string;
  description: string;
}

interface AppointmentsProps {
  appointments: Appointment[];
  patients: Patient[];
}

const STATUS_OPTIONS = ["ALL", "WAITING", "UPCOMING", "COMPLETED"];
const DATE_OPTIONS = ["ALL", "TODAY", "THIS_WEEK", "THIS_MONTH"] as const;

type DateFilter = (typeof DATE_OPTIONS)[number];

export default function Appointments({
  appointments,
  patients,
}: AppointmentsProps) {
  const [selectedPatient, setSelectedPatient] =
    React.useState<Appointment | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [selectedDate, setSelectedDate] = React.useState<DateFilter>("ALL");
  const [showAppointments, setShowAppointments] = React.useState(false);
  const [showPayments, setShowPayments] = React.useState(false);
  const [showNewAppointment, setShowNewAppointment] = React.useState(false);
  const [showNewPayment, setShowNewPayment] = React.useState(false);

  const [newAppointment, setNewAppointment] = React.useState({
    date: "",
    time: "",
    notes: "",
  });

  const [newPayment, setNewPayment] = React.useState({
    amount: "",
    date: "",
    time: "",
    description: "",
  });

  const isInDateRange = React.useCallback(
    (appointmentDate: string, filter: DateFilter) => {
      const date = new Date(appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const appointmentDay = new Date(date);
      appointmentDay.setHours(0, 0, 0, 0);

      switch (filter) {
        case "TODAY":
          return appointmentDay.getTime() === today.getTime();
        case "THIS_WEEK": {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return appointmentDay >= startOfWeek && appointmentDay <= endOfWeek;
        }
        case "THIS_MONTH": {
          return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          );
        }
        default:
          return true;
      }
    },
    []
  );

  const filteredAppointments = React.useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesStatus =
        selectedStatus === "ALL" ||
        appointment.status.status.toUpperCase() === selectedStatus;

      const matchesDate = isInDateRange(appointment.date, selectedDate);

      return matchesStatus && matchesDate;
    });
  }, [appointments, selectedStatus, selectedDate, isInDateRange]);

  const handleAppointmentsClick = (patientId: number) => {
    setSelectedPatient(
      appointments.find((app) => app.patientId === patientId) || null
    );
    setShowAppointments(true);
  };

  const handlePaymentsClick = (patientId: number) => {
    setSelectedPatient(
      appointments.find((app) => app.patientId === patientId) || null
    );
    setShowPayments(true);
  };

  const handleNewAppointment = () => {
    // Here you would typically send the newAppointment data to your backend
    console.log("New appointment:", newAppointment);
    setShowNewAppointment(false);
    setNewAppointment({ date: "", time: "", notes: "" });
  };

  const handleNewPayment = () => {
    // Here you would typically send the newPayment data to your backend
    console.log("New payment:", newPayment);
    setShowNewPayment(false);
    setNewPayment({ amount: "", date: "", time: "", description: "" });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Manage your appointments</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Select
                value={selectedDate}
                onValueChange={(value) => setSelectedDate(value as DateFilter)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_OPTIONS.map((dateOption) => (
                    <SelectItem key={dateOption} value={dateOption}>
                      {dateOption === "ALL"
                        ? "All Dates"
                        : dateOption
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0) + word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "ALL" ? "All Status" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No appointments found for the selected filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      {appointment.patient.user.firstName}{" "}
                      {appointment.patient.user.lastName}
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      {appointment.action.appointmentType.type}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appointment.status.status === "Confirmed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {appointment.status.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() =>
                          handleAppointmentsClick(appointment.patientId)
                        }
                      >
                        Appointments
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handlePaymentsClick(appointment.patientId)
                        }
                      >
                        Payments
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={showAppointments}
        onOpenChange={() => setShowAppointments(false)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointments</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {selectedPatient.patient.user.firstName}{" "}
                {selectedPatient.patient.user.lastName}
                's Appointments
              </h3>
              {/* Here you would map through the patient's appointments */}
              <Button onClick={() => setShowNewAppointment(true)}>
                New Appointment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPayments} onOpenChange={() => setShowPayments(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payments</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {selectedPatient.patient.user.firstName}{" "}
                {selectedPatient.patient.user.lastName}
                's Payments
              </h3>
              {/* Here you would map through the patient's payments */}
              <Button onClick={() => setShowNewPayment(true)}>
                New Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNewAppointment}
        onOpenChange={() => setShowNewAppointment(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                className="col-span-3"
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, time: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                className="col-span-3"
                value={newAppointment.notes}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    notes: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleNewAppointment}>Save Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNewPayment}
        onOpenChange={() => setShowNewPayment(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, amount: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentDate" className="text-right">
                Date
              </Label>
              <Input
                id="paymentDate"
                type="date"
                className="col-span-3"
                value={newPayment.date}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentTime" className="text-right">
                Time
              </Label>
              <Input
                id="paymentTime"
                type="time"
                className="col-span-3"
                value={newPayment.time}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, time: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={newPayment.description}
                onChange={(e) =>
                  setNewPayment({
                    ...newPayment,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleNewPayment}>Save Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
