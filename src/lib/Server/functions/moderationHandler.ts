import { ActionResponse, Categories } from "@/lib/types/moderation";
import OpenAI from "openai";
export async function moderateText(
  text: string
): Promise<{ flags: Array<string>; action: ActionResponse }> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const results = await openai.moderations.create({
    input: text,
  });

  const result = results.results[0];
  if (!result.flagged) return { action: ActionResponse.NONE, flags: [] };

  //get list of flags with true value
  const flags = Object.entries(result.categories)
    .map(([key, value]) => {
      if (value === true) {
        return key;
      }
    })
    .filter((flag) => flag) as Array<string>;

  const action = processModerationResult(result.categories);

  return { action, flags: flags || [] };
}

export function processModerationResult(
  categories: OpenAI.Moderations.Moderation.Categories
) {
  console.log("🚀 ~ categories:", categories);

  const sexualHandler = new SexualContentHandler();
  const hateHandler = new HateContentHandler();
  const harassmentHandler = new HarassmentContentHandler();
  const selfHarmHandler = new SelfHarmContentHandler();
  const sexualMinorsHandler = new SexualMinorsContentHandler();
  const hateThreateningHandler = new HateThreateningContentHandler();
  const violenceGraphicHandler = new ViolenceGraphicContentHandler();
  const selfHarmIntentHandler = new SelfHarmIntentContentHandler();
  const selfHarmInstructionsHandler = new SelfHarmInstructionsContentHandler();
  const harassmentThreateningHandler =
    new HarassmentThreateningContentHandler();
  const violenceHandler = new ViolenceContentHandler();

  // Third degree violations
  selfHarmInstructionsHandler
    .setNext(sexualMinorsHandler)

    // Second degree violations
    .setNext(violenceGraphicHandler)
    .setNext(hateThreateningHandler)
    .setNext(harassmentThreateningHandler)
    .setNext(violenceHandler)

    // First degree violations
    .setNext(sexualHandler)
    .setNext(selfHarmIntentHandler)
    .setNext(selfHarmHandler)
    .setNext(hateHandler)
    .setNext(harassmentHandler);

  // Start processing
  const action = selfHarmInstructionsHandler.handle(categories);
  console.log("🚀 ~ action:", action?.toString() || "no result");
  return action;
}

interface ModerationHandler {
  setNext(handler: ModerationHandler): ModerationHandler;
  handle(moderationResponse: { [key: string]: boolean }): string | null;
}

abstract class AbstractModerationHandler implements ModerationHandler {
  private nextHandler: AbstractModerationHandler | null = null;

  public setNext(
    handler: AbstractModerationHandler
  ): AbstractModerationHandler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(moderationResponse: Categories): ActionResponse {
    const result = this.process(moderationResponse);
    if (result !== ActionResponse.NONE) {
      return result;
    } else if (this.nextHandler) {
      return this.nextHandler.handle(moderationResponse);
    }
    return ActionResponse.NONE;
  }

  protected abstract process(moderationResponse: Categories): ActionResponse;
}

class SexualContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse.sexual) {
      console.log("Handling sexual content...");
      return ActionResponse.NOTIFY;
    }
    return ActionResponse.NONE;
  }
}

class HateContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse.hate) {
      console.log("Handling hate content...");
      return ActionResponse.NOTIFY;
    }
    return ActionResponse.NONE;
  }
}

class HarassmentContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse.harassment) {
      console.log("Handling harassment content...");
      return ActionResponse.NOTIFY;
    }
    return ActionResponse.NONE;
  }
}

class SelfHarmContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse["self-harm"]) {
      console.log("Handling self-harm content...");
      return ActionResponse.NOTIFY;
    }
    return ActionResponse.NONE;
  }
}

class SexualMinorsContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse["sexual/minors"]) {
      console.log("Handling sexual/minors content...");
      return ActionResponse.QUARANTINE;
    }
    return ActionResponse.NONE;
  }
}

class HateThreateningContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse["hate/threatening"]) {
      console.log("Handling hate/threatening content...");
      return ActionResponse.SUSPEND;
    }
    return ActionResponse.NONE;
  }
}

class ViolenceGraphicContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse["violence/graphic"]) {
      console.log("Handling violence/graphic content...");
      return ActionResponse.SUSPEND;
    }
    return ActionResponse.NONE;
  }
}

class SelfHarmIntentContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse["self-harm/intent"]) {
      console.log("Handling self-harm/intent content...");
      return ActionResponse.RESCUE;
    }
    return ActionResponse.NONE;
  }
}

class SelfHarmInstructionsContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse["self-harm/instructions"]) {
      console.log("Handling self-harm/instructions content...");
      return ActionResponse.QUARANTINE;
    }
    return ActionResponse.NONE;
  }
}

class HarassmentThreateningContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse["harassment/threatening"]) {
      console.log("Handling harassment/threatening content...");
      return ActionResponse.SUSPEND;
    }
    return ActionResponse.NONE;
  }
}

class ViolenceContentHandler extends AbstractModerationHandler {
  protected process(moderationResponse: Categories): ActionResponse {
    if (moderationResponse.violence) {
      console.log("Handling violence content...");
      return ActionResponse.NOTIFY;
    }
    return ActionResponse.NONE;
  }
}
