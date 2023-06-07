import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export default authMiddleware({
  publicRoutes: [
    "/",
    "/:locale/sign-in",
    "/:locale/sign-up",
    "/sign-in",
    "/sign-up",
  ],
  afterAuth(auth, req, evt) {
    console.log(req);
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
