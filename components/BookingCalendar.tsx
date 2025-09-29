'use client';

// Calendar availability display component for the booking system
// Shows available time slots and integrates with the booking engine

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { Calendar, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';

import {
  AvailabilityResponse,
  AvailabilityQuery,
  TimeSlot,
  StaffMember
} from '@/types/booking';
import { bookingEngine } from '@/lib/booking-engine';

interface BookingCalendarProps {
  serviceType: string;
  isEmergency?: boolean;
  selectedDate?: string;
  selectedTime?: string;
  onTimeSlotSelect?: (date: string, time: string) => void;
  onStaffSelect?: (staffId: string) => void;
  className?: string;
}

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
  isAvailable: boolean;
  hasEmergencySlots?: boolean;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  serviceType,
  isEmergency = false,
  selectedDate,
  selectedTime,
  onTimeSlotSelect,
  onStaffSelect,
  className = ''
}) => {
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string>('');

  // Generate calendar days for the current month
  const getCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of week for first day (0 = Sunday)
    const firstDayOfWeek = firstDay.getDay();

    // Create array of all days to display (including previous month days)
    const days: CalendarDay[] = [];

    // Add previous month days to fill first row
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, month, -firstDayOfWeek + i + 1);
      days.push({
        date: prevDate,
        isToday: false,
        isSelected: false,
        isPast: prevDate < today,
        isAvailable: false
      });
    }

    // Add current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      const dateString = currentDate.toISOString().split('T')[0];

      // Check if this date has availability
      const dayAvailability = availabilityData?.date === dateString ? availabilityData : null;
      const isAvailable = dayAvailability ? dayAvailability.timeSlots.some(slot => slot.available) : false;
      const hasEmergencySlots = dayAvailability ? dayAvailability.timeSlots.some(slot => slot.isEmergency && slot.available) : false;

      days.push({
        date: currentDate,
        isToday: currentDate.toDateString() === today.toDateString(),
        isSelected: selectedDate === dateString,
        isPast: currentDate < today,
        isAvailable,
        hasEmergencySlots
      });
    }

    // Add next month days to complete the grid (42 days total)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isToday: false,
        isSelected: false,
        isPast: nextDate < today,
        isAvailable: false
      });
    }

    return days;
  };

  // Load availability data
  const loadAvailability = async (date: string) => {
    if (!serviceType) return;

    setLoading(true);
    try {
      const query: AvailabilityQuery = {
        serviceType,
        date,
        isEmergency
      };

      const availability = await bookingEngine.checkAvailability(query);
      setAvailabilityData(availability);
    } catch (error) {
      console.error('Failed to load availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load availability when service type, emergency status, or selected date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailability(selectedDate);
    }
  }, [serviceType, isEmergency, selectedDate]);

  // Handle date selection
  const handleDateSelect = (dateString: string) => {
    if (onTimeSlotSelect) {
      onTimeSlotSelect(dateString, '');
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (onTimeSlotSelect && timeSlot.available) {
      const timeString = timeSlot.startTime.split('T')[1]?.substring(0, 5) || '';
      onTimeSlotSelect(timeSlot.startTime.split('T')[0] || '', timeString);
    }
  };

  // Handle staff selection
  const handleStaffSelect = (staffId: string) => {
    setSelectedStaff(staffId);
    onStaffSelect?.(staffId);
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = (): TimeSlot[] => {
    if (!availabilityData || !selectedDate) return [];
    return availabilityData.timeSlots.filter(slot => slot.available);
  };

  // Get available staff members
  const getAvailableStaff = (): StaffMember[] => {
    return availabilityData?.staffMembers || [];
  };

  const calendarDays = getCalendarDays(currentMonth);
  const timeSlots = getAvailableTimeSlots();
  const availableStaff = getAvailableStaff();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Available Appointments</span>
              </CardTitle>
              <CardDescription>
                {isEmergency ? 'Emergency appointments available' : 'Standard consultation times'}
              </CardDescription>
            </div>
            {isEmergency && (
              <Badge className="bg-red-100 text-red-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Emergency
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
                setCurrentMonth(prevMonth);
              }}
            >
              Previous
            </Button>

            <h3 className="text-lg font-semibold">
              {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </h3>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
                setCurrentMonth(nextMonth);
              }}
            >
              Next
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  p-2 text-center text-sm border rounded-lg cursor-pointer transition-colors
                  ${day.isToday ? 'bg-blue-50 border-blue-200' : ''}
                  ${day.isSelected ? 'bg-blue-100 border-blue-300' : ''}
                  ${day.isPast ? 'text-gray-400 cursor-not-allowed' : ''}
                  ${day.isAvailable && !day.isPast ? 'hover:bg-green-50 hover:border-green-200' : ''}
                  ${day.hasEmergencySlots ? 'ring-2 ring-red-200' : ''}
                `}
                onClick={() => !day.isPast && handleDateSelect(day.date.toISOString().split('T')[0])}
              >
                <div className="font-medium">{day.date.getDate()}</div>
                {day.isAvailable && !day.isPast && (
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1" />
                )}
                {day.hasEmergencySlots && (
                  <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1" />
                )}
              </div>
            ))}
          </div>

          {/* Selected Date Info */}
          {selectedDate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                {new Date(selectedDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h4>

              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="space-y-4">
                  {/* Available Time Slots */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Available Times
                    </h5>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map((slot, index) => (
                        <Button
                          key={index}
                          variant={selectedTime === slot.startTime.split('T')[1]?.substring(0, 5) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`text-xs ${slot.isEmergency ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' : ''}`}
                        >
                          {slot.startTime.split('T')[1]?.substring(0, 5)}
                          {slot.isEmergency && (
                            <AlertCircle className="w-3 h-3 ml-1 inline" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Available Staff */}
                  {availableStaff.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Available Staff
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {availableStaff.map((staff) => (
                          <Button
                            key={staff.id}
                            variant={selectedStaff === staff.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleStaffSelect(staff.id)}
                            className="text-xs"
                          >
                            {staff.name}
                            {staff.emergencyContact && (
                              <Badge className="ml-2 bg-red-100 text-red-700 text-xs">
                                Emergency
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No appointments available for this date.
                    {availabilityData?.nextAvailable && (
                      <span className="block mt-1">
                        Next available: {new Date(availabilityData.nextAvailable.date).toLocaleDateString('en-GB')} at {availabilityData.nextAvailable.time}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Information */}
      {isEmergency && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Emergency Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-700">
            <ul className="space-y-1 text-sm">
              <li>• Emergency appointments are prioritised and confirmed immediately</li>
              <li>• You will receive a callback within 2 hours of booking</li>
              <li>• Same-day appointments available for urgent cases</li>
              <li>• Crisis assessment will be conducted during booking</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <span>Emergency Slot</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-2 text-blue-600" />
              <span>Selected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCalendar;