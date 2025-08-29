"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Mail,
  Phone,
  Shield,
  Tags,
  User,
  Verified,
} from "lucide-react";
import {
  useGetUserPreference,
  useGetUserProfile,
} from "@/hooks/api/useUserProfile";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PreferencesModal } from "../../(student)/components/preferences-modal";
import { ProfilePictureUpload } from "@/components/shared/profile-picture-upload";
import { ChangePasswordForm } from "@/components/shared/change-password-form";

export default function ProfilePage() {
  const [showPreferences, setShowPreferences] = useState(false);

  const { data: user, isFetching } = useGetUserProfile();
  const { data: preferences, isFetching: isPreferencesLoading } =
    useGetUserPreference();

  const onClose = () => {
    setShowPreferences(false);
  };

  return (
    <div className="grid gap-6">
      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {isFetching ? (
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-8 w-32" />
            </div>
          ) : (
            <ProfilePictureUpload
              currentImageUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}${user?.profilePicture}`}
              userName={`${user?.firstName} ${user?.lastName}`}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <ProfileSkeleton />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <ProfileField
                label="First Name"
                value={user?.firstName}
                icon={<User className="h-4 w-4" />}
              />
              <ProfileField label="Middle Name" value={user?.middleName} />
              <ProfileField label="Last Name" value={user?.lastName} />
              <ProfileField
                label="Email"
                value={user?.email}
                icon={<Mail className="h-4 w-4" />}
                verified={user?.isEmailVerified}
              />
              <ProfileField
                label="Phone"
                value={user?.phone}
                icon={<Phone className="h-4 w-4" />}
              />
              <ProfileField
                label="Role"
                value={user?.role}
                icon={<Shield className="h-4 w-4" />}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/*Student Preferences*/}
      {user?.role === "student" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Preferred Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPreferencesLoading ? (
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {preferences?.categories?.length ? (
                  preferences.categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="px-4 py-1.5 text-sm"
                    >
                      {category.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No categories selected yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => setShowPreferences(true)}>
              Edit Preference
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <ProfileSkeleton />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <ProfileField
                label="Account Status"
                value={user?.isActive ? "Active" : "Inactive"}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Section */}
      <ChangePasswordForm className="w-full" />

      <PreferencesModal
        open={showPreferences}
        onClose={onClose}
        categoryIds={preferences?.categories.map((x) => x.id)}
      />
    </div>
  );
}

// Reusable component for profile fields
function ProfileField({
  label,
  value,
  icon,
  verified,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  verified?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <p className="font-medium">{value || "-"}</p>
        {verified && (
          <span className="text-emerald-500 flex items-center gap-1">
            <Verified className="h-4 w-4" />
            <span className="text-xs">Verified</span>
          </span>
        )}
      </div>
    </div>
  );
}

// Loading skeleton
function ProfileSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-full" />
        </div>
      ))}
    </div>
  );
}
