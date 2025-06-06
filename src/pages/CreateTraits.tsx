@@ -1,6 +1,5 @@
 import React, { useRef, useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
-import { useMediaQuery } from '@/hooks/useMediaQuery';
 import { Card, CardContent } from '../components/ui/card';
 import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
 import { Button } from '@/components/ui/button';
@@ -13,8 +12,7 @@
 }
 
 const CreateTraits: React.FC = () => {
-  const isDesktop = useMediaQuery('(min-width: 1024px)');
-  const navigate = useNavigate();
+  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
 
   if (!isDesktop) {
     return (
@@ -26,7 +24,7 @@
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
-            <Button onClick={() => navigate('/')}>
+            <Button onClick={() => window.location.href = '/'}>
               Return to Home
             </Button>
           </AlertDialogFooter>