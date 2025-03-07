import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAuthRedirect = () => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/register");
        }
    }, [status, router]);

    // No need to return anything
};

export default useAuthRedirect;
