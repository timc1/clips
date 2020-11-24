import { TArticle, TClipVisibility } from "lib/types";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import Clip from "./clip";

let Article;

try {
  if (mongoose.model("Article")) {
    Article = mongoose.model("Article");
  }
} catch (e) {
  if (e.name === "MissingSchemaError") {
    const ArticleSchema = new mongoose.Schema(
      {
        authorId: {
          type: String,
          required: true,
        },
        clips: {
          type: [mongoose.Schema.Types.ObjectId],
        },
      },
      { timestamps: true }
    );

    ArticleSchema.statics.doesNotExist = async function (
      field
    ): Promise<boolean> {
      return (await this.where(field).countDocuments()) === 0;
    };

    ArticleSchema.statics.getLastArticle = async function (
      userId
    ): Promise<TArticle | undefined> {
      return (
        await this.where({ authorId: userId })
          .find()
          .limit(1)
          .sort({ $natural: -1 })
      )[0];
    };

    ArticleSchema.statics.getArticlesForUser = async function (
      userId: string,
      page: number,
      limit: number,
      clipVisibility: TClipVisibility
    ) {
      const aggregateQuery = [
        { $match: { authorId: userId } },
        {
          // Articles have a list of ObjectIds that map to clips.
          // Here, for each article that we find, we're populating
          // the article with the actual clip record.
          $lookup: {
            from: "clips",
            localField: "clips",
            foreignField: "_id",
            as: "clips",
          },
        },
        { $unwind: "$clips" },
        // Filter out clips based on its visibility – if owner, this
        // will be undefined.
        clipVisibility
          ? { $match: { "clips.visibility": { $gte: clipVisibility } } }
          : undefined,
        // Sort clips by createdAt.
        {
          $sort: { "clips.createdAt": -1 },
        },
        // Regroup back to the shape of Article model.
        {
          $group: {
            _id: "$_id",
            authorId: { $first: "$authorId" },
            clips: { $push: "$clips" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
        // Finally, sort articles by createdAt.
        { $sort: { createdAt: -1 } },
      ].filter((i) => i);

      const aggregate = Article.aggregate(aggregateQuery);

      return await this.aggregatePaginate(aggregate, { page, limit });
    };

    ArticleSchema.statics.getClipsForArticle = async function (
      articleId: string,
      visibility?: TClipVisibility
    ) {
      const article = (await this.where({ _id: articleId }).find().limit(1))[0];

      if (!article) {
        return null;
      }
      const params = { _id: { $in: article.clips }, isRemoved: false };

      const query = visibility ? { ...params, visibility } : params;

      const clips = await Clip.find(query).sort({
        createdAt: -1,
      });

      return clips;
    };

    ArticleSchema.methods.addClipToArticle = async function (
      userId: string,
      articleId: string,
      clipId: string
    ) {
      if (this.authorId !== userId) {
        return { permissionDenied: true };
      }

      return await Article.findByIdAndUpdate(
        articleId,
        {
          $push: {
            clips: clipId,
          },
        },
        { new: true }
      );
    };

    ArticleSchema.plugin(mongooseAggregatePaginate);

    Article = mongoose.model("Article", ArticleSchema);
  }
}

export default Article;
