import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
}

const CreateTraits: React.FC = () => {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (!isDesktop) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desktop Only</AlertDialogTitle>
            <AlertDialogDescription>
              This feature is only available on desktop devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
}