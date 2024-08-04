import { addPost, fetchPosts, fetchTags } from "@/api/api";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

interface Post {
  readonly id?: number | string;
  title: string;
  tags: string[];
}

function PostList() {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isError: isAddPostErr,
    isPending: isAddPostPending,
    reset: resetAddPost,
  } = useMutation({
    mutationKey: ["addPost"],
    mutationFn: addPost,

    //runs before the mutation function is called
    onMutate: (post: Post) => {
      console.log("onMutate", post);
      return { context: "the onMutate context" };
    },
    // runs after the mutation function is called
    onSuccess: (data: Post, variables, context) => {
      console.log("onSuccess", data);
      console.log("context", context);

      //   validate the data
      if (data.title === "") {
        throw new Error("Title is required");
      }

      queryClient.invalidateQueries({
        queryKey: ["posts"],

        exact: true, // if true, only invalidate the exact queryKey
        // predicate: (query) => query.queryKey[0] === "posts", // if false, invalidate all queries that match the queryKey
      });
    },

    onError: (error, variables, context) => {
      console.log("onError", error);
      console.log("context", context);
    },

    onSettled: (data, error, variables, context) => {
      console.log("onSettled", data);
      console.log("context", context);
    },
  });

  const [formData, setformData] = useState<Post>({
    title: "",
    tags: [],
  });

  return (
    <div className="p-2">
      <h1 className="flex justify-between items-center p-3">
        <span
          className="text-3xl font-bold text-gray-800 p-2"
          data-testid="app-title"
        >
          My Posts
        </span>
      </h1>

      <div>
        <div className="grid grid-cols-1 gap-2 p-3 max-w-md">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setformData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Post Title"
            className="border border-gray-300 p-2 rounded"
          />

          <div className="flex gap-2 flex-wrap">
            {tagsData?.map((tag: string, index: number) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setformData((prev) => ({
                        ...prev,
                        tags: [...prev.tags, e.target.value],
                      }));
                    } else {
                      setformData((prev) => ({
                        ...prev,
                        tags: prev.tags.filter((t) => t !== e.target.value),
                      }));
                    }
                  }}
                  className="mr-2"
                />
                {tag}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => createPost(formData)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            {isAddPostPending ? "Adding..." : "Add Post"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3">
        {isLoading && <div>Loading...</div>}
        {isError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
        )}
        {data?.map((post: Post, index: number) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.tags.join(", ")}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PostList;
