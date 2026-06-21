Validation côté serveur — Limite de 5 images

Ce document fournit deux exemples simples pour valider côté backend que le nombre d'images envoyées lors de la création d'un bien ne dépasse pas 5.

1. Exemple Java Spring Boot (contrôleur)

```java
@RestController
@RequestMapping("/api/biens/gestionnaire")
public class BienController {

  @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> creerBien(
      @RequestParam(required = false, name = "photos") MultipartFile[] photos,
      @RequestParam String libelle,
      @RequestParam String adresse,
      // autres champs...
  ) {
    if (photos != null && photos.length > 5) {
      Map<String, Object> body = new HashMap<>();
      body.put("message", "Maximum 5 photos autorisées");
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // validation métier supplémentaire, enregistrement, stockage des fichiers...

    return ResponseEntity.status(HttpStatus.CREATED).body(/* DTO résultat */);
  }
}
```

Remarques Spring Boot:

- Vous pouvez utiliser `@ControllerAdvice` pour centraliser les erreurs.
- Si vous stockez les fichiers (S3, disque, Blob), vérifiez le contenu (type, taille) et limitez la taille globale d'upload via `spring.servlet.multipart.max-file-size` / `max-request-size`.

2. Exemple Node.js / Express avec `multer`

```js
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: '/tmp/uploads' })
const router = express.Router()

// multer permet déjà de limiter le nombre de fichiers via .array(name, maxCount)
router.post('/create', upload.array('photos', 5), (req, res) => {
  // si l'utilisateur envoie plus de 5, multer refuse et la requête est bloquée
  const files = req.files || []
  if (files.length > 5) {
    return res.status(400).json({ message: 'Maximum 5 photos autorisées' })
  }

  // autres champs: req.body.libelle, req.body.adresse, ...
  // enregistrez les fichiers et créez la ressource
  res.status(201).json({
    /* résultat */
  })
})

module.exports = router
```

Conseils et bonnes pratiques:

- Répliquer la validation côté client (déjà en place) et côté serveur (source de vérité).
- Valider aussi le type MIME et la taille maximale par fichier.
- Fournir un message d'erreur clair (HTTP 400) pour les clients.
- Pour Java/Spring, vous pouvez lever `ResponseStatusException` ou renvoyer `ResponseEntity`.

Test rapide (curl):

```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -F "typeBien=APPARTEMENT" \
  -F "libelle=Test" \
  -F "adresse=Dakar" \
  -F "photos=@img1.jpg" \
  -F "photos=@img2.jpg" \
  -F "photos=@img3.jpg" \
  -F "photos=@img4.jpg" \
  -F "photos=@img5.jpg" \
  http://your-backend.example.com/api/biens/gestionnaire/create
```

Si vous voulez, je peux générer un patch pour le repository backend si vous me fournissez le repo ou le code du contrôleur actuel.
