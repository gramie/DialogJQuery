<?php
class DB {
    var $pdo;

    function __construct(string $database_file) {
        $this->pdo = new \PDO("sqlite:" . $database_file);
    }
    
    public function fetchData(int $conversation_id, string $language_code) : array {
        $statement = $this->pdo->prepare("SELECT r.response_id, r.speaker
                                          FROM responses r 
                                          INNER JOIN lines l
                                            ON r.response_id = l.response_id
                                          WHERE r.conversation_id = :conversation_id");
        $statement->execute(['conversation_id' => $conversation_id]);
        $responses = $statement->fetchAll(PDO::FETCH_ASSOC);
        
        $statement = $this->pdo->prepare("SELECT l.*, t.translated_text
                                          FROM lines l
                                          INNER JOIN responses r ON l.response_id=r.response_id
                                          LEFT JOIN translations t ON l.line_id=t.line_id
                                          INNER JOIN languages lang ON t.language_id=lang.language_id
                                          WHERE r.conversation_id = :conversation_id
                                          AND lang.language_code = :language_code
                                          ORDER BY l.sort_order");
        $statement->execute(['conversation_id' => $conversation_id, 'language_code' => $language_code]);
        $lines = $statement->fetchAll(PDO::FETCH_ASSOC);

        $statement = $this->pdo->query("SELECT c.line_id, c.response_id
                                        FROM connections c
                                        INNER JOIN lines l ON c.line_id=l.line_id
                                        INNER JOIN responses r ON l.response_id=r.response_id
                                        INNER JOIN conversations cv ON r.conversation_id=cv.conversation_id
                                        WHERE r.conversation_id = :conversation_id");
        $statement->execute(['conversation_id' => $conversation_id]);
        $connections = $statement->fetchAll(PDO::FETCH_KEY_PAIR);

      $result = $this->assembleData($responses, $lines, $connections);
      print_r($result);

      return $result;
    }

    protected function assembleData(array $responses, array $lines, array $connections) : array {
      $result = [];

      foreach ($lines as &$line) {
        $responses[$line['response_id']]['lines'][] = $line['line_id'];
        $line['connections'] = [];
      }

      foreach ($connections as $line_id => $targetResponseID) {
        $lines[$line_id]['connections'][] = $targetResponseID;
      }        

      return ['responses' => $responses, 'lines' => $lines];
    }
}

$data = new DB('conversation.sqlite3');
print_r($data->fetchData(1, 'en'));