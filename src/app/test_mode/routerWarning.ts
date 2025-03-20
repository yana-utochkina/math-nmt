import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useUnsavedChangesWarning = (shouldWarn: boolean) => {
  const router = useRouter();

  useEffect(() => {
    let isNavigating = false;

    const handleRouteChange = (url: string) => {
      if (shouldWarn && !url.includes("/result_page")) {
        const confirmExit = window.confirm("Ви впевнені що хочете перейти? Дані не збережуться... (^._.^)ﾉ");
        if (!confirmExit) {
          window.history.replaceState(null, "", window.location.pathname);
          isNavigating = false;
          return;
        }
        isNavigating = true;
      }
    };

    // обробник кліків на лого і реєстрацію/профіль
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a") as HTMLAnchorElement | null;
      if (link && shouldWarn) {
        const href = link.getAttribute("href");
        if (href && !href.includes("/result_page")) {
          event.preventDefault();
          handleRouteChange(href);
          if (isNavigating) router.push(href); // якщо вихід дозволено
        }
      }
    };

    // тимчасово відмикаєм кнопку "назад", та показуємо повідомлення (не розібрався ще щоб працювало нормально)
    const disableBack = () => {
      window.history.pushState(null, "", window.location.pathname);
    };

    const handlePopState = () => {
      if (shouldWarn) {
        alert("Тисніть на логотип (^◔ᴥ◔^)");
        disableBack();
      }
    };

    if (shouldWarn) {
      disableBack();
      window.addEventListener("popstate", handlePopState);
    }

    // обробник закриття вкладки чи перезавантаження
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldWarn) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn, router]);
};

export default useUnsavedChangesWarning;
