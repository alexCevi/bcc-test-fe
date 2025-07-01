import { memo } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
// Memoize the AppSidebar to prevent re-renders
const MemoizedSidebar = memo(AppSidebar);

// Main layout component
function MainLayout({ children }) {

    return (
        <SidebarProvider>
            <MemoizedSidebar />
            <SidebarInset>
                <main className="p-6">
                    <ProtectedRoute>
                        {children}
                    </ProtectedRoute>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

// Memoize the entire MainLayout component
export default memo(MainLayout);
