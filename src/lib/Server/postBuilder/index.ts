import { CreatePost, MBEmotion, MBSeverity, MBVisibility } from "../../types";
// Builder Class
class PostBuilder {
  private post: CreatePost;

  constructor(visibility: MBVisibility) {
    this.post = {
      description: "",
      image: null,
      gifURL: null,
      emotion: null,
      severity: null,
      visibility: visibility,
    };
  }

  setDescription(description: string): PostBuilder {
    this.post.description = description;
    return this;
  }

  setImage(image: HTMLImageElement | null): PostBuilder {
    this.post.image = image;
    return this;
  }

  setGifURL(gifURL: string | null): PostBuilder {
    this.post.gifURL = gifURL;
    return this;
  }

  setEmotion(emotion: MBEmotion | null): PostBuilder {
    this.post.emotion = emotion;
    return this;
  }

  setSeverity(severity: MBSeverity | null): PostBuilder {
    this.post.severity = severity;
    return this;
  }

  build(): CreatePost {
    return this.post;
  }

  async uploadImage(
    image: HTMLImageElement,
    visibility: MBVisibility
  ): Promise<string> {
    // Placeholder for image upload logic based on visibility
    // Implement the actual image upload logic here
    if (visibility === "public") {
      // Upload publicly
    } else if (visibility === "friends") {
      // Upload for friends only
    } else if (visibility === "anonymous") {
      // Upload anonymously
    }

    // Return a placeholder URL after upload
    return "uploaded_image_url";
  }

  async uploadPost(): Promise<CreatePost> {
    if (this.post.image) {
      const imageUrl = await this.uploadImage(
        this.post.image,
        this.post.visibility
      );
      // Assign the uploaded image URL to the post's gifURL or another property as needed
      this.post.gifURL = imageUrl;
    }

    // Placeholder for post upload logic
    // Implement the actual post upload logic here

    return this.post;
  }
}

// Usage Example
async function createAndUploadPost() {
  const builder = new PostBuilder("public");
  builder
    .setDescription("This is a new post")
    .setImage(document.createElement("img")) // Example image
    .setGifURL("https://example.com/gif")
    .setEmotion({ name: "happy", image: "https://example.com/happy.png" })
    .setSeverity({
      id: 1,
      name: "high",
      textColor: "#FF0000",
      color: "#FFA500",
    });

  const post = await builder.uploadPost();
  console.log(post);
}

createAndUploadPost();
