using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public GameObject[] enemyPrefab;
    public Transform enemyParent;

    public int startHealth;
    public int startCash;

    public int wave = 0;
    public bool isOver = true;

    public int[] enemies = new int[6];

    public GameObject mainCanvas;
    public GameObject gameOverCanvas;

    // Start is called before the first frame update
    void Start()
    {
        Overseer.health = startHealth;
        Overseer.cash = startCash;

       // StartCoroutine("SpawnEnemy");
    }
    private void Update()
    {
        if(Overseer.health <= 0)
        {
            GameOver();
        }
    }
    void GameOver()
    {
        mainCanvas.gameObject.SetActive(false);
        gameOverCanvas.gameObject.SetActive(true);
    }

    public void BeginWave()
    {
        if (!isOver) return;
        wave++;
        GenerateWave();
        StartCoroutine("SpawnWave");
        isOver = false;
    }

    void GenerateWave()
    {
        for (int i = 0; i < 6; i++)
        {
            enemies[i] = wave * 3 - i;
        }
    }

    IEnumerator SpawnWave()
    {
        int total = 0;
        foreach(int num in enemies)
        {
            total += num;
        }

        while(total > 0)
        {
            if (Overseer.health <= 0)
            {
                StopAllCoroutines();
            }
            for (int i = 0; i < 6; i++)
            {
                if(enemies[i] <= 0)
                {
                    continue;
                }
                while(enemies[i] > 0)
                {
                    yield return new WaitForSecondsRealtime(0.1f);
                    Instantiate(enemyPrefab[i], new Vector3(-18.4f, 18f, 0f), Quaternion.identity, enemyParent);
                    enemies[i]--;
                    total--;
                }
            }
            
        }
        isOver = true;
    }
}
