import Link from "next/link"
import { formatDate } from "~/lib/date"
import { Paginated, type PostOnSiteHome, Notes } from "~/lib/types"
import { EmptyState } from "../ui/EmptyState"
import { useRouter } from "next/router"
import { Image } from "~/components/ui/Image"
import { Button } from "~/components/ui/Button"

export const SiteHome: React.FC<{
  postPages?: Notes[]
  fetchNextPage: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
}> = ({ postPages, fetchNextPage, hasNextPage, isFetchingNextPage }) => {
  const router = useRouter()

  if (!postPages?.length) return null

  let currentLength = 0

  return (
    <>
      {!postPages[0].total && <EmptyState />}
      {postPages[0].total && (
        <div className="xlog-posts space-y-8">
          {postPages.map((posts) =>
            posts.list.map((post) => {
              currentLength++
              return (
                <Link
                  key={post.id}
                  href={`/${post.slug || post.id}`}
                  className="xlog-post hover:bg-zinc-100 bg-white transition-colors px-5 py-7 -mx-5 first:-mt-5 sm:rounded-xl flex flex-col sm:flex-row items-center"
                >
                  <div className="flex-1 flex justify-center flex-col w-full sm:w-auto">
                    <h3 className="xlog-post-title text-2xl font-bold">
                      {post.title}
                    </h3>
                    <div className="xlog-post-meta text-sm text-zinc-400 mt-1">
                      <span className="xlog-post-date">
                        {formatDate(post.date_published)}
                      </span>
                      <span className="xlog-post-tags ml-4 space-x-1">
                        {post.tags
                          ?.filter((tag) => tag !== "post" && tag !== "page")
                          .map((tag) => (
                            <span
                              className="hover:text-zinc-600"
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault()
                                router.push(`/tag/${tag}`)
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                      </span>
                    </div>
                    <div
                      className="xlog-post-excerpt mt-3 text-zinc-500"
                      style={{
                        wordBreak: "break-word",
                      }}
                    >
                      {post.summary?.content}
                      {post.summary?.content && "..."}
                    </div>
                  </div>
                  {post.cover && (
                    <div className="xlog-post-cover flex items-center relative w-full sm:w-24 h-24 mt-2 sm:ml-4 sm:mt-0">
                      <Image
                        className="object-cover rounded"
                        alt="cover"
                        fill={true}
                        src={post.cover}
                      ></Image>
                    </div>
                  )}
                </Link>
              )
            }),
          )}
        </div>
      )}
      {hasNextPage && (
        <Button
          className="mt-8 w-full hover:bg-zinc-100 bg-zinc-50 transition-colors text-sm"
          variant="text"
          onClick={fetchNextPage}
          isLoading={isFetchingNextPage}
        >
          There are {postPages[0].total - currentLength} more post
          {postPages[0].total - currentLength > 1 ? "s" : ""}, click to load
          more
        </Button>
      )}
    </>
  )
}
