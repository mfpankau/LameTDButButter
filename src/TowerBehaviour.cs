using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TowerBehaviour : MonoBehaviour
{
    public int tier;
    public int price;
    public float radius;
    public float fireRate;
    public int damage;
    bool placed = false;
    public bool canBePlaced = true;

    float timeTillShot = 0f;
    bool colliding = false;

    public int kills = 0;

    public void Begin()
    {
        gameObject.name = $"Tower(T{tier})";
        placed = true;
        canBePlaced = false;
        var rad = transform.GetChild(0);
        rad.GetComponent<SpriteRenderer>().enabled = false;
        rad.GetComponent<CircleCollider2D>().enabled = true;
    }

    // Update is called once per frame
    void Update()
    {
        timeTillShot -= Time.deltaTime;
        if (timeTillShot <= 0) timeTillShot = 0;
        CheckPlacement();
    }
    public void CheckPlacement()
    {
        if (!placed)
        {
            if (price > Overseer.cash || transform.position.x > 23.25f)
            {
                canBePlaced = false;
                transform.GetChild(0).GetComponent<SpriteRenderer>().color = Color.red;
            }
            else if(!colliding)
            {
                canBePlaced = true;
                transform.GetChild(0).GetComponent<SpriteRenderer>().color = Color.white;
            }
        }
    }
    void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.CompareTag("Tower") && canBePlaced)
        {
            canBePlaced = false;
            colliding = true;
            transform.GetChild(0).GetComponent<SpriteRenderer>().color = Color.red;
        }
        
    }
    private void OnTriggerStay2D(Collider2D collision)
    {
        if (collision.CompareTag("Tower") && canBePlaced)
        {
            canBePlaced = false;
            colliding = true;
            transform.GetChild(0).GetComponent<SpriteRenderer>().color = Color.red;
        }
        if (collision.CompareTag("Enemy") && placed)
        {
            if (timeTillShot != 0) return;
            collision.GetComponent<EnemyBehaviour>().Hit(damage);
            Overseer.cash += collision.GetComponent<EnemyBehaviour>().value; ;
            timeTillShot = fireRate;
            kills++;
        }
    }
    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.CompareTag("Tower") && !canBePlaced && !placed)
        {
            canBePlaced = true;
            colliding = false;
            transform.GetChild(0).GetComponent<SpriteRenderer>().color = Color.white;
        }
    }
}
