<script lang="ts">
  import type { BaseUrl } from "@http-client";
  import type { PatchReviews } from "../Patch.svelte";

  import Icon from "@app/components/Icon.svelte";
  import NodeId from "@app/components/NodeId.svelte";

  export let baseUrl: BaseUrl;
  export let reviews: PatchReviews;

  $: sortedReviews = Array.from(Object.values(reviews)).sort((a, b) => {
    if (a.latest === b.latest) {
      return 0;
    } else if (b.latest) {
      return 1;
    } else {
      return -1;
    }
  });
</script>

<style>
  .header {
    font-size: var(--font-size-small);
    margin-bottom: 0.75rem;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: var(--font-size-small);
  }
  .review {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .review-accept {
    color: var(--color-foreground-success);
  }
  .review-reject {
    color: var(--color-foreground-red);
  }
  .txt-missing .review-accept,
  .txt-missing .review-reject {
    color: var(--color-foreground-dim);
  }
  @media (max-width: 1349.98px) {
    .wrapper {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
    }
    .header {
      margin-bottom: 0;
      height: 2rem;
      display: flex;
      align-items: center;
    }
    .no-reviews {
      display: flex;
      align-items: center;
    }
    .body {
      flex-direction: row;
    }
  }
</style>

<div class="wrapper">
  <div class="header">Reviews</div>
  <div class="body">
    {#each sortedReviews as { latest, review }}
      <div
        class="review"
        class:txt-missing={!latest}
        title={!latest
          ? `This review was on a previous revision. Please ask ${review.author.alias} to re-review`
          : ""}>
        <span
          class:review-accept={review.verdict === "accept"}
          class:review-reject={review.verdict === "reject"}>
          {#if review.verdict === "accept"}
            <Icon name="checkmark" />
          {:else if review.verdict === "reject"}
            <Icon name="cross" />
          {:else}
            <Icon name="chat" />
          {/if}
        </span>
        <NodeId
          {baseUrl}
          nodeId={review.author.id}
          alias={review.author.alias} />
      </div>
    {:else}
      <div class="txt-missing no-reviews">No reviews</div>
    {/each}
  </div>
</div>
