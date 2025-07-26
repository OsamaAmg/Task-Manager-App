'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Add this import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Mail, Phone, MapPin, Edit2, Save, X, LogOut, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

interface LoadingStates {
  saving: boolean;
  signingOut: boolean;
}

export default function ProfilePage() {
  const router = useRouter(); // Add this line
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - replace with actual user data from your auth system
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'I love organizing my tasks and staying productive. This app helps me manage my daily workflow efficiently.',
    avatar: '' // Add avatar URL if available
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  
  // Validation and error handling
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    saving: false,
    signingOut: false
  });

  // Dialog states
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  // Validation function
  const validateProfile = (profileData: UserProfile): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Name validation
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (profileData.name.trim().length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }
    
    // Email validation
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (profileData.phone.trim()) {
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
    setErrorMessage('');
    setSuccessMessage('');
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
      setErrorMessage('Please fix the validation errors before saving.');
      return;
    }
    
    setLoading('saving', true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setProfile(editedProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Here you would typically save to your backend/database
      console.log('Profile updated:', editedProfile);
    } catch (error) {
      setErrorMessage('Failed to save profile. Please try again.');
      console.error('Save error:', error);
    } finally {
      setLoading('saving', false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    clearMessages();
  };

  const handleSignOut = async () => {
    setSignOutDialogOpen(false);
    setLoading('signingOut', true);
    clearMessages();
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically handle sign out logic
      // e.g., clear tokens, call your auth service, etc.
      console.log('User signed out');
      
      // Clear any stored auth data
      // localStorage.removeItem('token'); // if using localStorage
      // or call your auth provider's signOut method
      
      setSuccessMessage('Successfully signed out!');
      
      // Redirect to landing page after a brief delay to show success message
      setTimeout(() => {
        router.push('/');
      }, 1500);
      
    } catch (error) {
      setErrorMessage('Failed to sign out. Please try again.');
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

  return (
    <div className="container mx-auto p-6 max-w-2xl">
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

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} alt={profile.name} />
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
                      value={editedProfile.name}
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
                      value={editedProfile.email}
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
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className={validationErrors.phone ? 'border-red-500' : ''}
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.phone}</p>
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
                    value={editedProfile.bio}
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

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">18</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">6</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">75%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}