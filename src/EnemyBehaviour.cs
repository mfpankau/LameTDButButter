using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyBehaviour : MonoBehaviour
{
    public List<Transform> waypoints;
    public int curIdx;
    public float speed = 0.01f;
    public int hp;
    public int[] nums;
    public int value;

    Rigidbody2D rb;
    // Start is called before the first frame update
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        waypoints = new List<Transform>();
        foreach (var child in GameObject.Find("Waypoints").GetComponentsInChildren<Transform>()) {
            waypoints.Add(child);
        }
        waypoints.RemoveAt(0);
        curIdx = 0;
    }

    // Update is called once per frame
    void Update()
    {
        
        rb.MoveRotation(
            Mathf.Atan2(    //get angle
                transform.position.y - waypoints[curIdx].position.y, //opposite
                transform.position.x - waypoints[curIdx].position.x  //adjacent
            ) * 180f / Mathf.PI + 90f
            );
        //transform.localRotation = Quaternion.Euler(0f, 0f, 0f);
        Vector2 move = Vector2.MoveTowards(transform.position, waypoints[curIdx].position, speed);
        rb.MovePosition(move);

        if (Vector3.Distance(transform.position, waypoints[curIdx].position) <= 0.01)
        {
            curIdx++;
            if(curIdx > waypoints.Count - 1)
            {

                Die();
            }
        }
    }

    public void Hit(int dmg)
    {
        hp -= dmg;
        if(hp <= 0)
        {
            Debug.Log("dead");
            Destroy(this.gameObject);
        }
    }
    void Die()
    {
        Debug.Log("dead");
        Overseer.health -= hp;
        if(Overseer.health <= 0)
        {
            Debug.Log("Game over you suck.");
        }
        Destroy(this.gameObject);
        
    }
}
