import { useState, useEffect } from "react";
import { fine } from "../libs/fine";
import { Schema } from "../libs/db-types";

export function useUserRole() {
  const { data: session } = fine.auth.useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const users = await fine.table("users")
          .select("role")
          .eq("id", session.user.id);
        
        if (users && users.length > 0) {
          setUserRole(users[0].role || null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [session?.user?.id]);

  return { userRole, isLoading };
}