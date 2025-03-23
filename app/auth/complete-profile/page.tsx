"use client";
import React, { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { useCompleteProfile } from "@/hooks/pages/useCompleteProfile";
import renderHeader from "@/components/sections/auth/completeProfile/renderHeader";
import renderDateOfBirthField from "@/components/sections/auth/completeProfile/renderDateOfBirthField";
import renderPhoneField from "@/components/sections/auth/completeProfile/renderPhoneField";
import renderSexSelection from "@/components/sections/auth/completeProfile/renderSexSelection";
import renderSubmitButton from "@/components/sections/auth/completeProfile/renderSubmitButton";

function CompleteProfileInner() {
  const {
    tempToken,
    isLoading,
    handleSubmit,
    sexId,
    setField,
    dateOfBirth,
    errors,
  } = useCompleteProfile();

  if (!tempToken) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        {renderHeader()}
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderDateOfBirthField(dateOfBirth, setField, errors)}
          {renderPhoneField()}
          {renderSexSelection(sexId, setField, errors)}
          {renderSubmitButton(isLoading, errors)}
        </form>
      </Card>
    </div>
  );
}

export default function CompleteProfile() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <CompleteProfileInner />
    </Suspense>
  );
}
