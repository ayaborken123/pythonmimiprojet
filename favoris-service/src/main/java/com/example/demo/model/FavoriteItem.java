@Document(collection = "favorites")
public class FavoriteItem {
    @Id
    private String id;
    private String userId;
    private String itemId;
    private LocalDateTime addedAt = LocalDateTime.now();
    
    // Getters/Setters
}