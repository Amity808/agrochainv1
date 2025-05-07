import { useState, useEffect } from "react";
import { fine } from "../libs/fine";

export type UserRole = "farmer" | "consumer" | "manufacturer" | undefined;

export function useUserRole() {
  const { data: session, isPending } = fine.auth.useSession();
  const [userRole, setUserRole] = useState<UserRole>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // First check if the user has a role in the database
        const users = await fine.table("users")
          .select("role")
          .eq("id", session.user.id);
        
        if (users.length > 0 && users[0].role) {
          setUserRole(users[0].role as UserRole);
        } else {
          // If no role in database, check user metadata
          // const metadata = await fine.auth.getUserMetadata();
          // if (metadata?.role) {
          //   setUserRole(metadata.role as UserRole);
            
          //   // Update the database with the role from metadata
          //   await fine.table("users")
          //     .update({ role: metadata.role })
          //     .eq("id", session.user.id);
          // }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [session]);

  return { userRole, isLoading };
}