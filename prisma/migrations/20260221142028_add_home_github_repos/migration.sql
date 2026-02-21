-- CreateTable
CREATE TABLE "home_github_repos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "github_owner" TEXT NOT NULL,
    "github_repo" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "home_github_repos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_github_repos_sort_order_idx" ON "home_github_repos"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "home_github_repos_github_owner_github_repo_key" ON "home_github_repos"("github_owner", "github_repo");
