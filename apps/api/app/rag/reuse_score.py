def calculate_reuse_score(retrieved_assets: list[dict], similarity_threshold: float = 0.65) -> dict:
    """
    Converts raw similarity scores into a business-facing reuse
    percentage, matching the brief's "Reusable from Library: X%"
    requirement (Section 5/8).
    """
    if not retrieved_assets:
        return {"reuse_percentage": 0, "new_generation_percentage": 100, "usable_assets": []}

    usable = [a for a in retrieved_assets if a["similarity"] >= similarity_threshold]

    if not usable:
        return {"reuse_percentage": 0, "new_generation_percentage": 100, "usable_assets": []}

    avg_similarity = sum(a["similarity"] for a in usable) / len(usable)
    reuse_pct = round(avg_similarity * 100)

    return {
        "reuse_percentage": reuse_pct,
        "new_generation_percentage": 100 - reuse_pct,
        "usable_assets": [{"id": a["id"], "similarity": round(a["similarity"], 4)} for a in usable],
    }