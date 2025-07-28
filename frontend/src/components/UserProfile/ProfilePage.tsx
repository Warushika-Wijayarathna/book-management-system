import { useState, useEffect } from "react"
import { useAuth } from "../../context/useAuth"
import { updateProfile, changePassword } from "../../services/profileService"
import { Avatar } from "../ui/Avatar"
import Button from "../ui/button/Button"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import toast from "react-hot-toast"
import axios from "axios"

interface ProfileFormData {
  name: string
  email: string
  bio: string
  phone: string
  address: string
  dateOfBirth: string
  profilePicture: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const { user, updateUser, fetchUserProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: "",
    email: "",
    bio: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    profilePicture: ""
  })

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [avatarStyle, setAvatarStyle] = useState<'initials' | 'avataaars' | 'personas'>('avataaars')

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
        profilePicture: user.profilePicture || ""
      })
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const updatedUser = await updateProfile(profileData)
      updateUser(updatedUser)
      toast.success("Profile updated successfully!")
      
      // Refresh user data to ensure consistency
      await fetchUserProfile()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update profile")
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    setPasswordLoading(true)
    
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      toast.success("Password changed successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to change password")
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  const generateNewAvatar = () => {
    // Clear profile picture to force avatar regeneration
    setProfileData(prev => ({ ...prev, profilePicture: "" }))
    toast.success("Avatar style updated!")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar
                name={user.name}
                email={user.email}
                src={profileData.profilePicture}
                size={80}
                style={avatarStyle}
              />
              <button
                onClick={generateNewAvatar}
                className="absolute -bottom-2 -right-2 bg-brand-500 text-white rounded-full p-2 hover:bg-brand-600 transition-colors"
                title="Generate new avatar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 4L4 8L8 8" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "password"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("avatar")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "avatar"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Avatar Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Bio</Label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {profileData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <Label>Address</Label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <Label>Profile Picture URL (Optional)</Label>
                <Input
                  type="url"
                  value={profileData.profilePicture}
                  onChange={(e) => setProfileData(prev => ({ ...prev, profilePicture: e.target.value }))}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  required
                />
              </div>
              
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "avatar" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Avatar Style
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['initials', 'avataaars', 'personas'] as const).map((style) => (
                    <div
                      key={style}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        avatarStyle === style
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setAvatarStyle(style)}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar
                          name={user.name}
                          email={user.email}
                          size={60}
                          style={style}
                        />
                        <span className="font-medium capitalize text-gray-900 dark:text-white">
                          {style}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={generateNewAvatar}>
                  Apply Avatar Style
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
