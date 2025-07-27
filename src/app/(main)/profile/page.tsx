'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Mail, Phone, Edit2, Save, X, LogOut, AlertCircle, CheckCircle, XCircle, Loader2, Calendar, TrendingUp, Clock, Target, BarChart3 } from "lucide-react";
import { getAuthHeaders, removeAuthToken, isAuthenticated, getAuthToken, isTokenExpired } from '@/lib/auth';
import { toast } from 'sonner';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  createdAt: string;
}

interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  successRate: number;
  tasksThisWeek: number;
  completedThisWeek: number;
  tasksByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  recentTasks: Array<{
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    dueDate?: string;
  }>;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

interface LoadingStates {
  loading: boolean;
  saving: boolean;
  signingOut: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  
  // Validation and error handling
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    saving: false,
    signingOut: false
  });

  // Dialog states
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  // Check authentication and fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Enhanced authentication checking
        console.log('Checking authentication status...');
        
        const token = getAuthToken();
        console.log('Token found:', !!token);
        console.log('Token value (first 10 chars):', token ? token.substring(0, 10) + '...' : 'null');
        
        if (!token) {
          console.log('No token found, redirecting to login...');
          router.push('/auth/login');
          return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log('Token is expired, removing and redirecting...');
          removeAuthToken();
          router.push('/auth/login');
          return;
        }

        const authStatus = isAuthenticated();
        console.log('Authentication status:', authStatus);
        
        if (!authStatus) {
          console.log('Not authenticated, redirecting to login...');
          router.push('/auth/login');
          return;
        }
        
        console.log('User is authenticated, fetching profile...');

        const headers = getAuthHeaders();
        console.log('Request headers:', headers);

        const response = await fetch('/api/user/profile', {
          headers: headers
        });

        console.log('Profile API response status:', response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.log('401 Unauthorized - removing token and redirecting...');
            removeAuthToken();
            router.push('/auth/login');
            return;
          }
          const errorText = await response.text();
          console.error('Profile API error:', errorText);
          throw new Error(`Failed to fetch profile: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Profile data received:', { hasUser: !!data.user, hasAnalytics: !!data.analytics });
        
        setProfile(data.user);
        setAnalytics(data.analytics);
        setEditedProfile(data.user);
        
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data');
        
        // If it's a network error or server error, don't redirect
        // But if it's an auth error, redirect
        if (error instanceof Error && error.message.includes('401')) {
          removeAuthToken();
          router.push('/auth/login');
        }
      } finally {
        setLoadingStates(prev => ({ ...prev, loading: false }));
      }
    };

    fetchProfile();
  }, [router]);

  // Validation function
  const validateProfile = (profileData: Partial<UserProfile>): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Name validation
    if (!profileData.name?.trim()) {
      errors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (profileData.name.trim().length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }
    
    // Email validation
    if (!profileData.email?.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (profileData.phone?.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = profileData.phone.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 10) {
        errors.phone = 'Please enter a valid phone number';
      }
    }
    
    // Bio validation (optional but with limits)
    if (profileData.bio && profileData.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }
    
    return errors;
  };

  // Set loading state helper
  const setLoading = (key: keyof LoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  // Clear all messages
  const clearMessages = () => {
    setValidationErrors({});
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    clearMessages();
    
    const updatedProfile = {
      ...editedProfile,
      [field]: value
    };
    
    setEditedProfile(updatedProfile);
    
    // Clear validation error for this field
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSave = async () => {
    clearMessages();
    
    // Validate the profile
    const errors = validateProfile(editedProfile);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the validation errors before saving.');
      return;
    }
    
    setLoading('saving', true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editedProfile)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile. Please try again.');
      console.error('Save error:', error);
    } finally {
      setLoading('saving', false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
    clearMessages();
  };

  const handleSignOut = async () => {
    setSignOutDialogOpen(false);
    setLoading('signingOut', true);
    
    try {
      // Clear auth token
      removeAuthToken();
      
      toast.success('Successfully signed out!');
      
      // Redirect to landing page after a brief delay to show success message
      setTimeout(() => {
        router.push('/');
      }, 1500);
      
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
      console.error('Sign out error:', error);
      setLoading('signingOut', false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTaskDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loadingStates.loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !analytics) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Failed to load profile data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                className="flex items-center gap-2"
                disabled={loadingStates.saving}
              >
                {loadingStates.saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loadingStates.saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                className="flex items-center gap-2"
                disabled={loadingStates.saving}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2"
                disabled={loadingStates.signingOut}
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
              <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    disabled={loadingStates.signingOut}
                  >
                    {loadingStates.signingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {loadingStates.signingOut ? 'Signing Out...' : 'Sign Out'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      Sign Out Confirmation
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out? You will be logged out of your account and redirected to the home page. Any unsaved changes will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={loadingStates.signingOut}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSignOut}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      disabled={loadingStates.signingOut}
                    >
                      {loadingStates.signingOut ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Signing Out...
                        </>
                      ) : (
                        <>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={profile.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={editedProfile.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className={validationErrors.name ? 'border-red-500' : ''}
                      />
                      {validationErrors.name && (
                        <p className="text-sm text-red-600">{validationErrors.name}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-semibold">{profile.name}</h2>
                      <p className="text-muted-foreground">{profile.email}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Member since {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className={validationErrors.email ? 'border-red-500' : ''}
                      />
                      {validationErrors.email && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  {isEditing ? (
                    <div>
                      <Input
                        id="phone"
                        value={editedProfile.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        className={validationErrors.phone ? 'border-red-500' : ''}
                      />
                      {validationErrors.phone && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{profile.phone || 'Not provided'}</p>
                  )}
                </div>          
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <div>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className={`resize-none ${validationErrors.bio ? 'border-red-500' : ''}`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        {validationErrors.bio && (
                          <p className="text-sm text-red-600">{validationErrors.bio}</p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {editedProfile.bio?.length || 0}/500 characters
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {profile.bio || 'No bio provided yet.'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validation Summary */}
          {Object.keys(validationErrors).length > 0 && isEditing && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Please Fix These Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-red-600">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      <span className="capitalize">{field}:</span> {error}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recentTasks.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentTasks.slice(0, 5).map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Created {formatTaskDate(task.createdAt)}
                          {task.dueDate && ` • Due ${formatTaskDate(task.dueDate)}`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent tasks found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          {/* Task Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Task Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{analytics.totalTasks}</p>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{analytics.completedTasks}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{analytics.pendingTasks}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{Math.round(analytics.successRate)}%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                </div>
                
                {analytics.inProgressTasks > 0 && (
                  <div className="text-center pt-2 border-t">
                    <p className="text-xl font-bold text-blue-500">{analytics.inProgressTasks}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tasks Created</span>
                  <span className="font-semibold">{analytics.tasksThisWeek}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tasks Completed</span>
                  <span className="font-semibold text-green-600">{analytics.completedThisWeek}</span>
                </div>
                {analytics.tasksThisWeek > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Weekly Completion</span>
                      <span className="font-semibold">
                        {Math.round((analytics.completedThisWeek / analytics.tasksThisWeek) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(analytics.completedThisWeek / analytics.tasksThisWeek) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High Priority</span>
                  </div>
                  <span className="font-semibold">{analytics.tasksByPriority.high}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Medium Priority</span>
                  </div>
                  <span className="font-semibold">{analytics.tasksByPriority.medium}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Low Priority</span>
                  </div>
                  <span className="font-semibold">{analytics.tasksByPriority.low}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Tasks Alert */}
          {analytics.overdueTasks > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                You have <strong>{analytics.overdueTasks}</strong> overdue task{analytics.overdueTasks > 1 ? 's' : ''} that need attention.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}