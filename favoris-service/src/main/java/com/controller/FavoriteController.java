@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    
    private final FavoriteService service;

    @GetMapping("/{userId}")
    public ResponseEntity<List<FavoriteItem>> getUserFavorites(@PathVariable String userId) {
        return ResponseEntity.ok(service.getFavorites(userId));
    }

    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteItem favorite) {
        service.addFavorite(favorite);
        return ResponseEntity.created(URI.create("/api/favorites")).build();
    }
}