@Document(collection = "favorites")
public class FavoriteItem {
    @Id
    private String id;
    private String userId;   // correspond à l'ID de l'étudiant
    private String itemId;   // correspond à l'ID de la formation
    private LocalDateTime addedAt = LocalDateTime.now();

    // Getters & Setters
}
